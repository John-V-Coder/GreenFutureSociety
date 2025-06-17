from societyapp import views
from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('',views.index, name='index'),
    path('service/',views.service, name='Service'),
    path('partners/', views.partners, name='partners'),
    path('green-campaign/', views.green_campaign, name='green_campaign'),
    path('stories/', views.stories, name='stories'),
    path('events/', views.events, name='events'),
    path('farming-academy/', views.farming_academy, name='farming_academy'),
    path('blog/',views.blog, name='blog'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('contact/',views.contact, name='contact'),
    path('donate/',views.donate, name='donate'),
    path('donation/update/<int:donation_id>/', views.donation_update, name='donation_update'),
]
