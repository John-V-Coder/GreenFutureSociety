from django.shortcuts import render, redirect,get_object_or_404
from societyapp.models import Contact, Product, Order, OrderItem, BlogPost, Donation
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from math import ceil
from reportlab.pdfgen import canvas
from django.forms import modelformset_factory
from django.db.models import Prefetch
from .forms import EditOrderForm
from django.views.generic import TemplateView
from collections import defaultdict
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.http import HttpResponse, JsonResponse
import json, logging, uuid


# Create your views here.
def index(request):
    allProds = []
    catprods = Product.objects.values('category', 'id')
    categories = {item['category'] for item in catprods}

    for cat in categories:
        prod = Product.objects.filter(category=cat)
        n = len(prod)
        nSlides = n // 4 + ceil((n / 4) - (n // 4))
        allProds.append([prod, range(1, nSlides), nSlides])

    params = {'allProds': allProds} 

   
    return render(request, 'index.html', params)

def contact(request):
    if request.method=="POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        desc = request.POST.get("desc")
        pnumber = request.POST.get("pnumber")
        myquery = Contact(name=name, email=email, desc=desc,phonenumber=pnumber)
        myquery.save()
        messages.info(request, "Your message has been sent successfully, I will get back to you soon.") 
        return render(request, "contact.html")   
    return render(request, "contact.html")

def service(request):
    return render(request, "service.html")


logger = logging.getLogger(__name__)
@login_required
def checkout(request):
    print("View reached: checkout()")
    products = Product.objects.all()

    if request.method == 'POST':
        try:
            items_json = request.POST.get('itemsJson', '{}')
            name = request.POST.get('name', '').strip()
            email = request.user.email
            phone = request.POST.get('phone', '').strip()
            address = request.POST.get('address', '').strip()
            notes = request.POST.get('notes', '').strip()

            try:
                parsed_items = json.loads(items_json)
            except json.JSONDecodeError as json_error:
                parsed_items = {}

            order = Order.objects.create(
                user=request.user,
                name=name,
                email=email,
                phone=phone,
                planting_location=address,
                items_json=json.dumps(parsed_items),  # Optional for backup/logs
                special_instructions=notes,
            )

            # Create related OrderItem entries
            for item_id, item_data in parsed_items.items():
                quantity = int(item_data[0])
                product_name = item_data[1]

                try:
                    product = Product.objects.get(id=item_id)
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity
                    )
                except Product.DoesNotExist:
                    print(f"Product with ID {item_id} does not exist. Skipping...")

            request.session.pop('cart', None)

            return redirect('user_profile')

        except Exception as e:
            return render(request, 'checkout.html', {
                'products': products,
                'error': f"An error occurred: {str(e)}"
            })

    return render(request, 'checkout.html', {
        'products': products,
        'user_email': request.user.email
    })


class ProfileView(TemplateView):
    template_name = 'user_profile.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        orders = Order.objects.filter(user=user).prefetch_related('items__product')

        status_groups = defaultdict(list)
        for order in orders:
            status_groups[order.status].append(order)

        context['status_groups'] = dict(status_groups)
        return context

@login_required
def cart_data_api(request):
    cart = request.session.get('cart', {})  # cart = { product_id: quantity }
    products = []

    for product_id, qty in cart.items():
        try:
            product = Product.objects.get(id=product_id)
            products.append({
                'id': product.id,
                'name': product.product_name,
                'category': product.category,
                'desc': product.desc,
                'quantity': qty
            })
        except Product.DoesNotExist:
            continue

    return JsonResponse({'products': products})


@login_required
def edit_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)

    if request.method == 'POST':
        form = EditOrderForm(request.POST, instance=order, order_instance=order)
        if form.is_valid():
            form.save()
            return redirect('user_profile')
    else:
        form = EditOrderForm(instance=order, order_instance=order)

    return render(request, 'edit_order.html', {
        'form': form,
        'order': order
    })


@login_required
def user_profile(request):
    user_orders = Order.objects.filter(user=request.user).prefetch_related(
        Prefetch('items', queryset=OrderItem.objects.select_related('product'))
    ).order_by('-created_at')

    status_groups = {
        'pending': [],
        'confirmed': [],
        'completed': [],
    }

    all_orders = []
    total_trees = 0

    for order in user_orders:
        parsed_items = []
        for item in order.items.all():
            product = item.product
            parsed_items.append({
                'name': product.product_name,
                'quantity': item.quantity,
                'image_url': product.image.url if product.image else None,
            })
            total_trees += item.quantity

        order.parsed_items = parsed_items
        status_groups[order.status].append(order)
        all_orders.append(order)

    paginator = Paginator(all_orders, 5)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'user_profile.html', {
        'user': request.user,
        'status_groups': status_groups,
        'total_trees': total_trees,
        'page_obj': page_obj,
    })

@login_required
def order_detail(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    return render(request, 'order_detail.html', {'order': order})




def download_receipt(request, order_id):
   
    order = get_object_or_404(
        Order.objects.prefetch_related('items__product'),
        id=order_id,
        user=request.user
    )

    context = {
        'order': order,
        'items': order.items.all(),  
        'user': request.user
    }

    html = render_to_string('receipt_template.html', context)

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="receipt_order_{order.id}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)

    if pisa_status.err:
        return HttpResponse('Error generating PDF receipt. Please try again.', status=500)

    return response

def blog(request):
    posts = BlogPost.objects.all()
    paginator = Paginator(posts, 6)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'blog.html', {'blog_posts': page_obj})

def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug)
    return render(request, 'blog_detail.html', {'post': post})


def donate(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        amount = request.POST.get('amount')
        message = request.POST.get('message')
        payment_method = request.POST.get('payment_method')
        proof_file = request.FILES.get('proof')  # Only applicable to bank

        if not amount or float(amount) < 50:
            messages.error(request, "Donation must be at least KES 50.")
            return redirect('donate')

        if payment_method not in ['mpesa', 'bank']:
            messages.error(request, "Invalid payment method selected.")
            return redirect('donate')

        transaction_id = str(uuid.uuid4()).split('-')[0].upper()

        donation = Donation.objects.create(
            user=request.user if request.user.is_authenticated else None,
            full_name=full_name,
            email=email,
            amount=amount,
            payment_method=payment_method,
            message=message,
            transaction_id=transaction_id,
            status='pending',
            proof=proof_file if payment_method == 'bank' else None
        )

       
        if payment_method == 'mpesa':
            messages.success(request, f"Thank you {full_name}! Please pay KES {amount} to Till No: 719980.")
        else:
            messages.success(request, f"Thank you {full_name}! Upload your bank transfer receipt to complete the donation process.")

        return redirect('donate')

    return render(request, 'donate.html')



def donation_update(request, donation_id):
    donation = get_object_or_404(Donation, id=donation_id, user=request.user)

    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        amount = request.POST.get('amount')
        message = request.POST.get('message')
        payment_method = request.POST.get('payment_method')
        proof_file = request.FILES.get('proof')

        if not amount or float(amount) < 50:
            messages.error(request, "Donation must be at least KES 50.")
            return redirect('donation_update', donation_id=donation.id)

        if payment_method not in ['mpesa', 'bank']:
            messages.error(request, "Invalid payment method selected.")
            return redirect('donation_update', donation_id=donation.id)

     
        donation.full_name = full_name
        donation.email = email
        donation.amount = amount
        donation.message = message
        donation.payment_method = payment_method
        donation.status = 'pending' 

      
        if payment_method == 'bank' and proof_file:
            donation.proof = proof_file

        donation.save()

        messages.success(request, "Donation updated successfully. Awaiting confirmation.")
        return redirect('user_profile')

    return render(request, 'update_donation.html', {'donation': donation})