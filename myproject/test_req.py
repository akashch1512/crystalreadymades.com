import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from store.views import create_access_token
from store.models import User
from django.test import Client

user = User.objects.last()
token = create_access_token(user.id)

payload = {
    'name': user.name,
    'email': user.email or '',
    'contact_no': user.phone or '',
    'alt_contact_no': '',
    'line1': 'akash ka ghar',
    'line2': '',
    'locality': 'qaq',
    'city': 'ec',
    'state': 'a',
    'postal_code': '431001',
    'country': 'India',
    'address_type': 'Home',
    'is_default': True
}

client = Client(HTTP_AUTHORIZATION=f"Bearer {token}")
r = client.post("/api/addresses", data=payload, content_type="application/json")
print("Status Code:", r.status_code)
print("Length:", len(r.content))
print("Content:", r.content.decode('utf-8'))
