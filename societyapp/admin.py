from django.contrib import admin
from societyapp.models import Contact, Product, Order, Donation, BlogPost
# Register your models here.

admin.site.register(Contact)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(Donation)
admin.site.register(BlogPost)


class OrderAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name', 'email')


class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'published_at')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}

@admin.action(description='Mark selected donations as confirmed')
def mark_as_confirmed(modeladmin, request, queryset):
    queryset.update(status='confirmed')


class DonationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'amount', 'payment_method', 'status', 'date')
    list_filter = ('status', 'payment_method')
    actions = [mark_as_confirmed]    


