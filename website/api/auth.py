import sys

from rest_framework import exceptions

from api.models import AdminUser
from api.serializers import AdminUserSerializer


def jwt_response_payload_handler(token, user=None, request=None):
    try:
        admin = AdminUser.objects.get(user=user)
        u = AdminUserSerializer(admin).data
        u['name'] = admin.user.get_full_name()
    except AdminUser.DoesNotExist:
        raise exceptions.AuthenticationFailed()

    return {
        'token': token,
        'user': u,
    }
