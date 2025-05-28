from pyramid.view import view_config
from pyramid.response import Response

@view_config(route_name='ping', renderer='json')
def ping_view(request):
    """ A simple ping view to check if the app is running. """
    return {'status': 'ok', 'message': 'Hello from DenzShop API!'}