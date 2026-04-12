from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0002_address_address_type_address_alt_contact_no_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.deletion.CASCADE, related_name='children', to='store.category'),
        ),
    ]
