from django.shortcuts import render, redirect, get_object_or_404
from societyapp.models import Contact, BlogPost, Donation, green_campaign, Event, FarmingCourse, stories
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from math import ceil
from reportlab.pdfgen import canvas
from django.forms import modelformset_factory
from django.db.models import Prefetch
from django.views.generic import TemplateView
from collections import defaultdict
from django.core.paginator import Paginator
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from django.http import HttpResponse, JsonResponse
import json, logging, uuid


# Create your views here.
def index(request):
    context = {
        'particle_range': range(100)  
    }
    return render(request, 'index.html', context)

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

def partners(request):
    return render(request, 'partners.html')

def green_campaign(request):
    return render(request, 'green_campaign.html')

def stories(request):
    return render(request, 'stories.html')

def events(request):
    events = Event.objects.all().order_by('date')  # Optional: show events by date
    return render(request, 'events.html', {'events': events})

def farming_academy(request):
    courses = FarmingCourse.objects.all()
    return render(request, 'farming_academy.html', {'courses': courses})

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