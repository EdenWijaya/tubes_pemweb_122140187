def add_cors_headers(settings, request, response):
    """Tambahkan CORS headers ke response"""
    frontend_origin = settings.get('cors.frontend_origin', 'http://localhost:5173')
    response.headers.update({
        'Access-Control-Allow-Origin': frontend_origin,
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization, X-Requested-With',
        'Access-Control-Allow-Credentials': 'true'
    })
    return response

def cors_tween_factory(handler, registry):
    """Tween factory untuk menambahkan CORS ke semua response"""
    def cors_tween(request):
        if request.method == 'OPTIONS':
            response = request.response
            response.status_code = 204
            return add_cors_headers(registry.settings, request, response)
        try:
            response = handler(request)
            return add_cors_headers(registry.settings, request, response)
        except Exception as e:
            raise
    return cors_tween 

def includeme(config):
    """ This function is called when a module is included via config.include """
    config.add_tween('denzshop.cors_tween.cors_tween_factory')