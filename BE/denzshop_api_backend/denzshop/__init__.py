from pyramid.config import Configurator
from pyramid.authorization import ACLAuthorizationPolicy
# from pyramid.events import NewResponse # HAPUS ATAU KOMENTARI INI
from .models import init_sqlalchemy, DBSession

# HAPUS ATAU KOMENTARI FUNGSI add_cors_headers_response_callback LAMA
# def add_cors_headers_response_callback(event):
#     ...

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

        # HAPUS ATAU KOMENTARI SUBSCRIBER LAMA
        # config.add_subscriber(add_cors_headers_response_callback, NewResponse)

        # TAMBAHKAN CORS TWEEN BARU
        # Asumsi file di atas adalah denzshop/cors_tween.py
        config.include('.cors_tween') # Ini akan mencari includeme di cors_tween.py
                                    # atau bisa juga langsung:
                                    # config.add_tween('denzshop.cors_tween.cors_tween_factory')

        config.include('pyramid_jinja2')
        # ... (rute-rute Anda) ...
        config.add_route('ping', '/api/ping')
        config.add_route('test_db', '/api/test_db')
        config.add_route('register_user', '/api/register')
        config.add_route('login_user', '/api/login')
        config.add_route('get_products', '/api/products')
        config.add_route('get_product_detail', '/api/products/{product_id}')

        config.scan('.views')
    return config.make_wsgi_app()