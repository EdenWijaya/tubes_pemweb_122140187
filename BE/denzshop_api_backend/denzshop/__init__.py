from pyramid.config import Configurator
from .models import init_sqlalchemy, DBSession 
from pyramid.authorization import ACLAuthorizationPolicy

def main(global_config, **settings):
    engine = init_sqlalchemy(settings)

    with Configurator(settings=settings) as config:
        config.add_request_method(
            lambda request: DBSession,
            'dbsession',
            reify=True
        )

        # Include pyramid_jwt SEBELUM menggunakan directive-nya
        config.include('pyramid_jwt') # <--- TAMBAHKAN BARIS INI

        # Setup pyramid_jwt policy
        config.set_jwt_authentication_policy(
            settings['jwt.secret'],
            expiration=int(settings.get('jwt.expiration', 3600))
        )

        config.set_authorization_policy(ACLAuthorizationPolicy())

        config.include('pyramid_jinja2')
        # ... (rute-rute Anda) ...
        config.add_route('ping', '/api/ping')
        config.add_route('test_db', '/api/test_db')
        config.add_route('register_user', '/api/register')
        config.add_route('login_user', '/api/login')

        config.scan('.views')
    return config.make_wsgi_app()