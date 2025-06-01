from pyramid.view import view_config
from sqlalchemy import text, or_
from sqlalchemy.exc import IntegrityError # Untuk menangani error jika username/email sudah ada
from pyramid.httpexceptions import HTTPBadRequest, HTTPConflict, HTTPCreated, HTTPUnauthorized, HTTPForbidden, HTTPNotFound # Untuk response HTTP
# from pyramid.security import authenticated_userid
from .models import DBSession, User, Product # Import User model


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

        user = request.dbsession.query(User).filter(
            or_(User.username == identifier, User.email == identifier)
        ).first()

        if user and user.check_password(password):
            token = request.create_jwt_token(
                str(user.id), # Principal
                username=user.username,
                role=user.role  # <--- TAMBAHKAN 'role' KE PAYLOAD TOKEN JWT
            )
            return {
                'message': 'Login berhasil!',
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.role  # <--- TAMBAHKAN 'role' KE OBJEK USER DI RESPONS
                }
            }
        else:
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

def product_to_dict(product):
    """Helper function untuk mengubah objek Product menjadi dictionary."""
    return {
        'id': product.id,
        'name': product.name,
        'slug': product.slug,
        'description': product.description,
        'short_description': product.short_description,
        'price': product.price, # Ingat, ini dalam satuan terkecil
        'stock_quantity': product.stock_quantity,
        'category': product.category,
        'image_url': product.image_url,
        'created_at': product.created_at.isoformat() if product.created_at else None,
        'updated_at': product.updated_at.isoformat() if product.updated_at else None,
    }

@view_config(route_name='get_products', renderer='json', request_method='GET')
def get_products_view(request):
    try:
        products_query = request.dbsession.query(Product).order_by(Product.created_at.desc()).all()
        # Atau jika menggunakan DBSession langsung dari models:
        # products_query = DBSession.query(Product).order_by(Product.created_at.desc()).all()
        
        products_list = [product_to_dict(product) for product in products_query]
        
        return {'products': products_list}

    except Exception as e:
        print(f"Error mengambil produk: {e}") # Log error ke konsol server
        request.response.status_code = 500
        return {'error': f'Terjadi kesalahan pada server saat mengambil produk: {str(e)}'}
    
@view_config(route_name='get_product_detail', renderer='json', request_method='GET')
def get_product_detail_view(request):
    try:
        product_id = request.matchdict.get('product_id') # Ambil product_id dari URL
        if not product_id:
            raise HTTPNotFound(json_body={'error': 'Product ID tidak ditemukan di URL'})

        try:
            product_id = int(product_id) # Pastikan product_id adalah integer
        except ValueError:
            raise HTTPNotFound(json_body={'error': 'Product ID tidak valid'})

        # Menggunakan request.dbsession
        product = request.dbsession.query(Product).get(product_id)
        # Atau jika menggunakan DBSession langsung:
        # product = DBSession.query(Product).get(product_id)

        if product:
            return {'product': product_to_dict(product)}
        else:
            # Jika produk dengan ID tersebut tidak ditemukan
            raise HTTPNotFound(json_body={'error': f'Produk dengan ID {product_id} tidak ditemukan'})

    except HTTPNotFound as e: # Tangani HTTPNotFound secara spesifik
        request.response.status_code = e.status_code
        return e.json_body # Kembalikan body JSON dari error HTTPNotFound
    except Exception as e:
        print(f"Error mengambil detail produk: {e}")
        request.response.status_code = 500
        return {'error': f'Terjadi kesalahan pada server saat mengambil detail produk: {str(e)}'}
    
@view_config(route_name='admin_create_product', renderer='json', request_method='POST')
def admin_create_product_view(request):
    # Langkah 1: Pastikan ada pengguna yang terautentikasi
    current_user_id = request.authenticated_userid # Ini akan berisi user.id dari token JWT
    
    if not current_user_id:
        # Ini seharusnya tidak terjadi jika rute diakses dengan token yang valid,
        # tapi sebagai lapisan keamanan tambahan.
        raise HTTPForbidden(json_body={'error': 'Akses ditolak. Token tidak valid atau tidak ada.'})

    # Langkah 2: Ambil data pengguna dari database untuk memeriksa peran (role)
    user_for_role_check = request.dbsession.query(User).get(current_user_id)

    if not user_for_role_check or user_for_role_check.role != 'admin':
        raise HTTPForbidden(json_body={'error': 'Akses ditolak. Hanya untuk admin.'})

    # Jika lolos pemeriksaan di atas, berarti pengguna adalah admin. Lanjutkan:
    try:
        data = request.json_body
        name = data.get('name')
        slug = data.get('slug') # Idealnya, slug digenerate otomatis atau divalidasi unik
        price_str = data.get('price') # Ambil sebagai string dulu untuk validasi
        stock_quantity_str = data.get('stock_quantity') # Ambil sebagai string dulu

        # Validasi dasar input
        if not name:
            raise HTTPBadRequest(json_body={'error': 'Field "name" harus diisi.'})
        if not slug:
            raise HTTPBadRequest(json_body={'error': 'Field "slug" harus diisi.'})
        if price_str is None: # Harga bisa 0, jadi cek None
            raise HTTPBadRequest(json_body={'error': 'Field "price" harus diisi.'})
        if stock_quantity_str is None: # Stok bisa 0, jadi cek None
            raise HTTPBadRequest(json_body={'error': 'Field "stock_quantity" harus diisi.'})

        # Validasi dan konversi tipe data untuk harga dan stok
        try:
            price = int(price_str) # Atau float(price_str) jika Anda menyimpan desimal
            if price < 0:
                raise ValueError()
        except ValueError:
            raise HTTPBadRequest(json_body={'error': 'Harga harus berupa angka positif atau nol.'})

        try:
            stock_quantity = int(stock_quantity_str)
            if stock_quantity < 0:
                raise ValueError()
        except ValueError:
            raise HTTPBadRequest(json_body={'error': 'Kuantitas stok harus berupa angka integer positif atau nol.'})

        # Cek apakah slug sudah ada (slug harus unik)
        existing_product_slug = request.dbsession.query(Product).filter_by(slug=slug).first()
        if existing_product_slug:
            raise HTTPConflict(json_body={'error': f'Slug "{slug}" sudah digunakan.'})

        # Buat produk baru
        new_product = Product(
            name=name,
            slug=slug,
            description=data.get('description'),
            short_description=data.get('short_description'),
            price=price, # Gunakan harga yang sudah dikonversi ke angka
            stock_quantity=stock_quantity, # Gunakan stok yang sudah dikonversi ke angka
            category=data.get('category'),
            image_url=data.get('image_url')
        )

        request.dbsession.add(new_product)
        request.dbsession.flush() # Untuk mendapatkan ID produk baru dan memastikan constraint sebelum commit

        try:
            request.dbsession.commit() # Memastikan perubahan disimpan permanen
            print("TRANSAKSI BERHASIL DI-COMMIT untuk produk:", new_product.name) # Log untuk debugging
        except Exception as e_commit:
            request.dbsession.rollback() # Rollback jika commit gagal
            print(f"ERROR SAAT COMMIT: {e_commit}") # Log error commit
            raise # Lanjutkan error commit agar bisa ditangani atau tercatat

        return HTTPCreated(json_body={
            'message': 'Produk berhasil ditambahkan!',
            'product': product_to_dict(new_product) # Gunakan helper jika ada
        })

    except (HTTPBadRequest, HTTPConflict, HTTPForbidden) as e:
        request.response.status_code = e.status_code
        return e.json_body
    except IntegrityError as e:
        request.dbsession.rollback()
        print(f"INTEGRITY ERROR: {e.orig}") # Log detail IntegrityError
        return HTTPConflict(json_body={'error': 'Gagal menambahkan produk. Data unik sama.', 'detail': str(e.orig)})
    except Exception as e:
        request.dbsession.rollback()
        print(f"Error saat membuat produk (admin): {e}")
        request.response.status_code = 500
        return {'error': f'Terjadi kesalahan internal pada server: {str(e)}'}