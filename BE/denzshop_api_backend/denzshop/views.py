from pyramid.view import view_config
from sqlalchemy import text, or_
from sqlalchemy.exc import IntegrityError # Untuk menangani error jika username/email sudah ada
from pyramid.httpexceptions import HTTPBadRequest, HTTPConflict, HTTPCreated, HTTPUnauthorized # Untuk response HTTP


from .models import DBSession, User # Import User model

# ... (ping_view dan test_db_view yang sudah ada) ...

@view_config(route_name='register_user', renderer='json', request_method='POST')
def register_view(request):
    try:
        # Ambil data JSON dari body request
        data = request.json_body
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validasi dasar
        if not all([username, email, password]):
            raise HTTPBadRequest(json_body={'error': 'Username, email, dan password harus diisi.'})

        # Cek apakah username atau email sudah ada
        existing_user = DBSession.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()

        if existing_user:
            if existing_user.username == username:
                raise HTTPConflict(json_body={'error': f'Username "{username}" sudah digunakan.'})
            if existing_user.email == email:
                raise HTTPConflict(json_body={'error': f'Email "{email}" sudah terdaftar.'})

        # Buat user baru
        new_user = User(username=username, email=email)
        new_user.set_password(password) # Ini akan menghash password

        DBSession.add(new_user)
        DBSession.flush()
        DBSession.commit() 

        return HTTPCreated(json_body={
            'message': 'Registrasi berhasil!',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email
            }
        })

    except HTTPBadRequest as e:
        request.response.status = e.status_int
        return e.json_body
    except HTTPConflict as e:
        request.response.status = e.status_int
        return e.json_body
    except IntegrityError as e: # Jika ada unique constraint violation saat flush/commit
        DBSession.rollback()
        # Cek ulang mana yang duplikat untuk pesan error lebih baik jika perlu
        request.response.status = 409 # Conflict
        return {'error': 'Username atau email sudah ada (IntegrityError).'}
    except Exception as e:
        # Tangani error tak terduga lainnya
        DBSession.rollback() # Pastikan rollback jika ada error
        print(f"Error registrasi: {e}") # Log error ke konsol server
        request.response.status = 500 # Internal Server Error
        return {'error': f'Terjadi kesalahan pada server: {str(e)}'}
    
@view_config(route_name='login_user', renderer='json', request_method='POST')
def login_view(request):
    try:
        data = request.json_body
        identifier = data.get('identifier')
        password = data.get('password')

        if not all([identifier, password]):
            raise HTTPBadRequest(json_body={'error': 'Identifier (username/email) dan password harus diisi.'})

        user = DBSession.query(User).filter(
            or_(User.username == identifier, User.email == identifier)
        ).first()

        if user:
            # --- DEBUG PRINTS START ---
            print(f"User found: ID={user.id}, Username='{user.username}', Email='{user.email}'")
            # --- DEBUG PRINTS END ---
            password_match = user.check_password(password)
            # --- DEBUG PRINTS START ---
            print(f"Password check result for user '{user.username}': {password_match}")
            # --- DEBUG PRINTS END ---

            if password_match:
                token = request.create_jwt_token(
                    user.id,
                    username=user.username,
                )
                return {
                    'message': 'Login berhasil!',
                    'token': token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }
                }
            else:
                # --- DEBUG PRINTS START ---
                print(f"Password mismatch for user '{user.username}'.")
                # --- DEBUG PRINTS END ---
                raise HTTPUnauthorized(json_body={'error': 'Username/Email atau password salah.'})
        else:
            # --- DEBUG PRINTS START ---
            print(f"User with identifier '{identifier}' not found in database.")
            # --- DEBUG PRINTS END ---
            raise HTTPUnauthorized(json_body={'error': 'Username/Email atau password salah.'})

    except HTTPBadRequest as e:
        request.response.status = e.status_int
        return e.json_body
    except HTTPUnauthorized as e:
        request.response.status = e.status_int
        return e.json_body
    except Exception as e:
        print(f"Error login (unexpected): {e}") # Log error ke konsol server
        request.response.status = 500
        return {'error': f'Terjadi kesalahan pada server: {str(e)}'}