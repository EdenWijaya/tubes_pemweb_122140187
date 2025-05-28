from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.events import NewResponse # <--- TAMBAHKAN IMPORT INI
from .models import init_sqlalchemy, DBSession

# Fungsi callback untuk menambahkan header CORS
def add_cors_headers_response_callback(event):
    """
    Callback ini akan dipanggil untuk setiap response sebelum dikirim.
    Kita akan menambahkan header CORS di sini.
    """
    # Ambil origin frontend dari settings di .ini, default ke http://localhost:5173 (port umum Vite)
    # Ganti 5173 jika port default Vite Anda berbeda.
    frontend_origin = event.request.registry.settings.get('cors.frontend_origin', 'http://localhost:5173')

    event.response.headers.update({
        'Access-Control-Allow-Origin': frontend_origin,
        'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Authorization', # Authorization penting untuk JWT
        'Access-Control-Allow-Credentials': 'true', # Penting jika frontend mengirim cookies atau header Authorization
        # 'Access-Control-Max-Age': '3600' # Opsional: berapa lama hasil pre-flight bisa di-cache
    })

def main(global_config, **settings):
    engine = init_sqlalchemy(settings)

    with Configurator(settings=settings) as config:
        config.add_request_method(
            lambda request: DBSession,
            'dbsession',
            reify=True
        )

        config.include('pyramid_jwt')
        config.set_jwt_authentication_policy(
            settings['jwt.secret'],
            expiration=int(settings.get('jwt.expiration', 3600))
        )
        config.set_authorization_policy(ACLAuthorizationPolicy())

        # Tambahkan subscriber untuk CORS headers
        config.add_subscriber(add_cors_headers_response_callback, NewResponse) # <--- TAMBAHKAN BARIS INI

        config.include('pyramid_jinja2')
        # Rute-rute Anda
        config.add_route('ping', '/api/ping')
        config.add_route('test_db', '/api/test_db')
        config.add_route('register_user', '/api/register')
        config.add_route('login_user', '/api/login')

        config.scan('.views')
    return config.make_wsgi_app()