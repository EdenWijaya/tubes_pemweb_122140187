# denzshop/cors_tween.py
# from pyramid.response import Response # Tidak terpakai secara eksplisit di sini, tapi request.response adalah instance Response

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
            # if hasattr(e, 'response'): # Jika ingin menambahkan header ke response error HTTP
            #     add_cors_headers(registry.settings, request, e.response)
            raise
    return cors_tween # Pastikan return cors_tween ini ada di dalam cors_tween_factory

# --- Fungsi includeme HARUS berada di level modul (paling luar) ---
def includeme(config):
    """ This function is called when a module is included via config.include """
    # Path ke factory function Anda
    config.add_tween('denzshop.cors_tween.cors_tween_factory')