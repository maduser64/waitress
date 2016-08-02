from app.models import Passphrase
from rest_framework import status as status_code
from rest_framework.response import Response
from functools import wraps


def guard(func):
    """
    This decorator enforces passphrase authentication.
    """
    @wraps(func)
    def decorated_func(viewset, request, pk=None, *args, **kwargs):
        passphrase = request.POST.get('passphrase', None)
        if Passphrase.exists(passphrase).status:
            request.passphrase = Passphrase.exists(passphrase).matched_list[0]
            return func(viewset, request, pk, *args, **kwargs) if pk else func(viewset, request, *args, **kwargs)
        else:
            status = status_code.HTTP_401_UNAUTHORIZED
            return Response({'status': 'Invalid passphrase'}, status=status)

    return decorated_func
