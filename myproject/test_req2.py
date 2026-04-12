import urllib.request
import json
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from store.views import create_access_token
from store.models import User

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

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/addresses',
    data=json.dumps(payload).encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as f:
        print("Success:", f.read())
except urllib.error.HTTPError as e:
    res = e.read()
    print("Error:", e.code)
    print("Length:", len(res))
    print("Content:", res.decode('utf-8'))
