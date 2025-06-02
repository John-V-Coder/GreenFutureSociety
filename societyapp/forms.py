from django import forms
from .models import Order, OrderItem


class EditOrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['planting_location', 'special_instructions', 'status']

    def __init__(self, *args, **kwargs):
        self.order = kwargs.pop('order_instance', None)
        super().__init__(*args, **kwargs)

        if self.order:
            for item in self.order.items.all():
                # Tree name (disabled)
                self.fields[f'name_{item.id}'] = forms.CharField(
                    label="Tree Name",
                    initial=item.product.product_name,
                    disabled=True
                )

                # Editable quantity
                self.fields[f'quantity_{item.id}'] = forms.IntegerField(
                    label="Quantity",
                    initial=item.quantity,
                    min_value=1
                )

    def save(self, commit=True):
        instance = super().save(commit)
        for item in self.order.items.all():
            field_name = f'quantity_{item.id}'
            new_quantity = self.cleaned_data.get(field_name)
            if new_quantity is not None:
                item.quantity = new_quantity
                item.save()
        return instance
