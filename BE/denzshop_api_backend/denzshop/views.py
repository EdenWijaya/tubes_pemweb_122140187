from pyramid.view import view_config
from pyramid.response import Response # Sebenarnya tidak terpakai di contoh ini jika pakai renderer='json'
from sqlalchemy import text # Untuk menjalankan query SQL mentah jika perlu

from .models import DBSession # Import DBSession dari models.py

@view_config(route_name='ping', renderer='json')
def ping_view(request):
    """ A simple ping view to check if the app is running. """
    return {'status': 'ok', 'message': 'Hello from DenzShop API!'}

@view_config(route_name='test_db', renderer='json')
def test_db_view(request):
    """ A view to test database connection. """
    try:
        # Jalankan query sederhana
        result = DBSession.execute(text('SELECT 1 AS works')).scalar_one_or_none()
        if result == 1:
            return {'status': 'ok', 'message': 'Database connection success!'}
        else:
            # Ini seharusnya tidak terjadi jika query SELECT 1 berhasil
            return {'status': 'error', 'message': 'Database query did not return expected result.'}
    except Exception as e:
        # Jika ada error saat koneksi atau query
        print(f"Database connection error: {e}") # Log error ke konsol server
        return {'status': 'error', 'message': f'Database connection failed: {e}'}