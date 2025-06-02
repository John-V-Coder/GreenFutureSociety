from societyapp import views
from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required
from .views import ProfileView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.index, name='index'),
    path('service/',views.service, name='Service'),
    path('blog/',views.blog, name='blog'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('contact/',views.contact, name='contact'),
    path('checkout/',views.checkout, name='Checkout'),
    path('profile/',views.user_profile, name='user_profile'),
    path('profile/', login_required(ProfileView.as_view()), name='user_profile'),
    path('donate/',views.donate, name='donate'),
    path('donation/update/<int:donation_id>/', views.donation_update, name='donation_update'),
    path("api/cart-data/", views.cart_data_api, name="cart-data-api"),
    path('orders/<int:order_id>/', views.order_detail, name='order_detail'),
    path('orders/<int:order_id>/receipt/', views.download_receipt, name='download_receipt'),
    path('orders/<int:order_id>/edit/', views.edit_order, name='edit_order'),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)