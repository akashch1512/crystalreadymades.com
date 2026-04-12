import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from store.serializers import AddressSerializer

data = {
    'name': 'a',
    'email': '',
    'contact_no': '9545441133',
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

s = AddressSerializer(data=data)
s.is_valid()
print(len(str(s.errors).encode('utf-8')))
import json
print(json.dumps(s.errors))
