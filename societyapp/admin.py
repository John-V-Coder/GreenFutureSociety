from django.contrib import admin
from societyapp.models import Contact, Donation, BlogPost, green_campaign, stories, Event
# Register your models here.

admin.site.register(Contact)
admin.site.register(Donation)
admin.site.register(BlogPost)
admin.site.register(green_campaign)
admin.site.register(stories)
admin.site.register(Event)



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


