from pyramid.view import view_config
from sqlalchemy import text, or_
from sqlalchemy.exc import IntegrityError # Untuk menangani error jika username/email sudah ada
from pyramid.httpexceptions import HTTPBadRequest, HTTPConflict, HTTPCreated, HTTPUnauthorized, HTTPForbidden, HTTPNotFound, HTTPNoContent # Untuk response HTTP
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
    
@view_config(route_name='admin_update_product', renderer='json', request_method='PUT')
def admin_update_product_view(request):
    # Langkah 1: Pastikan ada pengguna yang terautentikasi dan adalah admin
    current_user_id = request.authenticated_userid
    if not current_user_id:
        raise HTTPForbidden(json_body={'error': 'Akses ditolak. Token tidak valid atau tidak ada.'})

    user_for_role_check = request.dbsession.query(User).get(current_user_id)
    if not user_for_role_check or user_for_role_check.role != 'admin':
        raise HTTPForbidden(json_body={'error': 'Akses ditolak. Hanya untuk admin.'})

    # Langkah 2: Dapatkan product_id dari URL
    product_id_str = request.matchdict.get('product_id')
    if not product_id_str:
        raise HTTPBadRequest(json_body={'error': 'Product ID tidak ada di URL.'})

    try:
        product_id = int(product_id_str)
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Product ID tidak valid.'})

    # Langkah 3: Ambil produk yang akan diupdate dari database
    product_to_update = request.dbsession.query(Product).get(product_id)
    if not product_to_update:
        raise HTTPNotFound(json_body={'error': f'Produk dengan ID {product_id} tidak ditemukan.'})

    # Langkah 4: Proses data update dari request body
    try:
        data = request.json_body
        
        # Flag untuk mengecek apakah ada perubahan
        has_changes = False

        if 'name' in data and data['name'] != product_to_update.name:
            product_to_update.name = data['name']
            has_changes = True
        if 'slug' in data and data['slug'] != product_to_update.slug:
            new_slug = data['slug']
            existing_slug = request.dbsession.query(Product).filter(Product.slug == new_slug, Product.id != product_id).first()
            if existing_slug:
                raise HTTPConflict(json_body={'error': f'Slug "{new_slug}" sudah digunakan oleh produk lain.'})
            product_to_update.slug = new_slug
            has_changes = True
        
        # Lanjutkan untuk field lain dengan pola yang sama (cek jika ada di 'data' dan berbeda dari nilai saat ini)
        if 'description' in data and data.get('description') != product_to_update.description:
            product_to_update.description = data.get('description')
            has_changes = True
        if 'short_description' in data and data.get('short_description') != product_to_update.short_description:
            product_to_update.short_description = data.get('short_description')
            has_changes = True
        
        if 'price' in data:
            try:
                price = int(data['price'])
                if price < 0: raise ValueError("Harga tidak boleh negatif")
                if price != product_to_update.price:
                    product_to_update.price = price
                    has_changes = True
            except (ValueError, TypeError):
                raise HTTPBadRequest(json_body={'error': 'Harga harus berupa angka integer positif atau nol.'})
        
        if 'stock_quantity' in data:
            try:
                stock_quantity = int(data['stock_quantity'])
                if stock_quantity < 0: raise ValueError("Stok tidak boleh negatif")
                if stock_quantity != product_to_update.stock_quantity:
                    product_to_update.stock_quantity = stock_quantity
                    has_changes = True
            except (ValueError, TypeError):
                raise HTTPBadRequest(json_body={'error': 'Kuantitas stok harus berupa angka integer positif atau nol.'})

        if 'category' in data and data.get('category') != product_to_update.category:
            product_to_update.category = data.get('category')
            has_changes = True
        if 'image_url' in data and data.get('image_url') != product_to_update.image_url:
            product_to_update.image_url = data.get('image_url')
            has_changes = True
        
        if not has_changes:
            return {'message': 'Tidak ada perubahan data pada produk.', 'product': product_to_dict(product_to_update)}

        # SQLAlchemy akan otomatis mendeteksi perubahan pada product_to_update
        # dan kolom updated_at akan diperbarui jika Anda set onupdate=func.now() di model

        request.dbsession.flush() # Kirim perubahan ke DB untuk validasi constraint, updated_at terpicu

        # ----- BLOK COMMIT EKSPLISIT YANG DIMINTA -----
        try:
            request.dbsession.commit() # Memastikan perubahan disimpan permanen
            print(f"TRANSAKSI UPDATE BERHASIL DI-COMMIT untuk produk ID: {product_to_update.id}")
        except Exception as e_commit:
            request.dbsession.rollback() # Rollback jika commit gagal
            print(f"ERROR SAAT COMMIT UPDATE: {e_commit}") 
            # Me-raise ulang error agar bisa ditangkap oleh blok except luar atau dicatat sebagai server error
            raise HTTPBadRequest(json_body={'error': f'Gagal menyimpan perubahan ke database: {str(e_commit)}'}) 
        # -----------------------------------------------

        return {'message': 'Produk berhasil diperbarui!', 'product': product_to_dict(product_to_update)}

    except (HTTPBadRequest, HTTPConflict, HTTPForbidden, HTTPNotFound) as e:
        # Rollback mungkin sudah dilakukan di atas jika commit gagal, tapi untuk error validasi sebelum flush/commit:
        # Jika belum ada operasi DB yang mengubah state, rollback tidak wajib tapi tidak berbahaya.
        request.dbsession.rollback() # Lebih aman untuk rollback di sini jika ada error sebelum commit berhasil
        request.response.status_code = e.status_code
        return e.json_body
    except IntegrityError as e: 
        request.dbsession.rollback()
        print(f"INTEGRITY ERROR saat update: {e.orig}")
        return HTTPConflict(json_body={'error': 'Gagal memperbarui produk. Pelanggaran integritas data (misal, slug duplikat).', 'detail': str(e.orig)})
    except Exception as e:
        request.dbsession.rollback()
        print(f"Error saat memperbarui produk (admin): {e}")
        request.response.status_code = 500
        return {'error': f'Terjadi kesalahan internal pada server: {str(e)}'}
    
@view_config(route_name='admin_delete_product', renderer='json', request_method='DELETE')
def admin_delete_product_view(request):
    # Langkah 1: Pastikan ada pengguna yang terautentikasi dan adalah admin
    current_user_id = request.authenticated_userid
    if not current_user_id:
        raise HTTPForbidden(json_body={'error': 'Akses ditolak. Token tidak valid atau tidak ada.'})

    user_for_role_check = request.dbsession.query(User).get(current_user_id)
    if not user_for_role_check or user_for_role_check.role != 'admin':
        raise HTTPForbidden(json_body={'error': 'Akses ditolak. Hanya untuk admin.'})

    # Langkah 2: Dapatkan product_id dari URL
    product_id_str = request.matchdict.get('product_id')
    if not product_id_str:
        raise HTTPBadRequest(json_body={'error': 'Product ID tidak ada di URL.'})

    try:
        product_id = int(product_id_str)
    except ValueError:
        raise HTTPBadRequest(json_body={'error': 'Product ID tidak valid.'})

    # Langkah 3: Ambil produk yang akan dihapus dari database
    product_to_delete = request.dbsession.query(Product).get(product_id)
    if not product_to_delete:
        raise HTTPNotFound(json_body={'error': f'Produk dengan ID {product_id} tidak ditemukan.'})

    # Langkah 4: Hapus produk
    try:
        request.dbsession.delete(product_to_delete)
        request.dbsession.flush() # Untuk memastikan operasi delete terkirim dan constraint dicek (jika ada relasi)

        # ----- BLOK COMMIT EKSPLISIT -----
        try:
            request.dbsession.commit()
            print(f"PRODUK ID: {product_id} BERHASIL DIHAPUS DAN DI-COMMIT")
        except Exception as e_commit:
            request.dbsession.rollback()
            print(f"ERROR SAAT COMMIT DELETE: {e_commit}")
            raise HTTPBadRequest(json_body={'error': f'Gagal menghapus produk dari database: {str(e_commit)}'})
        # -----------------------------------

        # Untuk operasi DELETE yang sukses, respons 204 No Content adalah yang paling umum
        # dan tidak memerlukan body JSON.
        return HTTPNoContent() 
        # Alternatif jika ingin mengirim pesan:
        # return {'message': f'Produk dengan ID {product_id} berhasil dihapus.'}


    except (HTTPBadRequest, HTTPForbidden, HTTPNotFound) as e: # Termasuk jika commit gagal dan raise HTTPBadRequest
        # Jika ada rollback di blok commit, mungkin tidak perlu rollback lagi di sini,
        # tapi untuk error lain sebelum commit, rollback aman.
        request.dbsession.rollback() 
        request.response.status_code = e.status_code
        return e.json_body
    except Exception as e: # Error tak terduga lainnya
        request.dbsession.rollback()
        print(f"Error saat menghapus produk (admin): {e}")
        request.response.status_code = 500
        return {'error': f'Terjadi kesalahan internal pada server saat menghapus produk: {str(e)}'}