import json
from django.core.management.base import BaseCommand
from societyapp.models import Order, OrderItem, Product

class Command(BaseCommand):
    help = 'Migrate JSON order items to OrderItem model'

    def handle(self, *args, **kwargs):
        orders = Order.objects.all()
        for order in orders:
            if hasattr(order, 'items_json') and order.items_json:
                try:
                    items_data = json.loads(order.items_json)
                    for name, data in items_data.items():
                        price, quantity, image_url = data

                        product = Product.objects.filter(product_name=name).first()
                        if not product:
                            self.stdout.write(self.style.WARNING(f"Product '{name}' not found. Skipping."))
                            continue

                        OrderItem.objects.create(
                            order=order,
                            product=product,
                            quantity=quantity,
                        )

                    self.stdout.write(self.style.SUCCESS(f"✅ Migrated Order #{order.id}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Error on Order #{order.id}: {e}"))
