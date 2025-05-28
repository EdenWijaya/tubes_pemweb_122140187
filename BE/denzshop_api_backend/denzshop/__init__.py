from pyramid.config import Configurator

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2') # Jika Anda berencana menggunakan template Jinja2 nanti
        config.add_route('ping', '/api/ping') # Rute tes awal
        config.scan('.views') # Scan views.py untuk konfigurasi @view_config
    return config.make_wsgi_app()