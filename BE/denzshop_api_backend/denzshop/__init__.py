from pyramid.config import Configurator
from .models import init_sqlalchemy # Import fungsi baru

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    # Panggil init_sqlalchemy untuk setup engine dan session
    engine = init_sqlalchemy(settings) # <--- PANGGIL DI SINI

    with Configurator(settings=settings) as config:
        # Kita tidak include pyramid_sqlalchemy lagi jika setup manual seperti ini,
        # karena kita sudah membuat engine dan session sendiri.
        # config.include('pyramid_sqlalchemy') # <--- KOMENTARI ATAU HAPUS INI

        # Menyediakan DBSession ke request jika tidak menggunakan pyramid_sqlalchemy
        # yang menyediakan request.dbsession
        config.add_request_method(
            lambda request: DBSession,
            'dbsession',
            reify=True
        )

        config.include('pyramid_jinja2')
        config.add_route('ping', '/api/ping')
        config.add_route('test_db', '/api/test_db')
        config.scan('.views')
    return config.make_wsgi_app()