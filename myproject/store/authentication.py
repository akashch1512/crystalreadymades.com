import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from .models import User

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split()
            if prefix.lower() != 'bearer':
                raise exceptions.AuthenticationFailed('Invalid token prefix')

            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get('sub')

            user = User.objects.get(id=user_id)

            if not user.is_active:
                raise exceptions.AuthenticationFailed('Account is disabled')

            if not user.is_email_verified and not (user.is_staff or user.is_superuser or user.role == 'admin'):
                raise exceptions.AuthenticationFailed('Email not verified')

            return (user, None)
        except (ValueError, jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            raise exceptions.AuthenticationFailed('Invalid token')


class JWTAuthenticationAllowUnverified(authentication.BaseAuthentication):
    """Same as JWTAuthentication but does NOT enforce email verification.
    Use ONLY on endpoints that allow an unverified user to re-verify (e.g. verify-email-change)."""

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split()
            if prefix.lower() != 'bearer':
                raise exceptions.AuthenticationFailed('Invalid token prefix')

            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get('sub')

            user = User.objects.get(id=user_id)

            if not user.is_active:
                raise exceptions.AuthenticationFailed('Account is disabled')

            return (user, None)
        except (ValueError, jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            raise exceptions.AuthenticationFailed('Invalid token')