# DenzShop - Toko Online Sederhana

## Deskripsi

DenzShop adalah aplikasi web toko online sederhana yang dibangun sebagai proyek pembelajaran untuk mendemonstrasikan implementasi frontend modern dengan React dan backend API dengan Python (Pyramid). Aplikasi ini memungkinkan pengguna untuk melihat produk, mendaftar, login, menambahkan item ke keranjang, dan melakukan proses checkout simulasi. Aplikasi ini juga menyertakan panel admin dasar untuk manajemen produk (CRUD).

Proyek ini dikembangkan dengan fokus pada pemahaman alur kerja full-stack, manajemen state di frontend, pembuatan API RESTful, interaksi database, dan implementasi fitur autentikasi pengguna.

## Fitur Utama

**Fitur Pengguna Umum:**

- **Registrasi Pengguna:** Pengguna baru dapat membuat akun.
- **Login Pengguna:** Pengguna yang sudah ada dapat masuk ke akun mereka menggunakan username/email dan password.
- **Autentikasi Berbasis Token (JWT):** Sesi pengguna dikelola menggunakan JSON Web Tokens.
- **Penjelajahan Produk:**
  - Halaman Beranda: Menampilkan Hero Section dinamis dan produk unggulan.
  - Halaman Daftar Produk: Menampilkan semua produk yang tersedia.
  - Halaman Detail Produk: Menampilkan informasi lengkap tentang satu produk.
- **Keranjang Belanja:**
  - Menambahkan produk ke keranjang.
  - Melihat isi keranjang.
  - Mengubah kuantitas item di keranjang.
  - Menghapus item dari keranjang.
  - Mengosongkan keranjang.
  - Data keranjang disimpan di `localStorage` untuk persistensi sesi browser.
- **Proses Checkout (Simulasi):**
  - Form untuk mengisi informasi pengiriman.
  - Ringkasan pesanan.
  - Tombol "Buat Pesanan" yang mensimulasikan penyelesaian pesanan dan mengosongkan keranjang.
- **Halaman Profil Pengguna:** Menampilkan informasi dasar pengguna yang login dan opsi logout.
- **Rute Terproteksi:** Halaman tertentu (misalnya, Keranjang, Checkout, Profil) hanya bisa diakses setelah login.
- **Desain Responsif:** Antarmuka pengguna dirancang agar dapat menyesuaikan diri dengan berbagai ukuran layar (desktop dan mobile), termasuk Navbar dengan hamburger menu.
- **Notifikasi Pengguna:** Menggunakan notifikasi toast untuk feedback aksi pengguna (sukses, error, info).

**Fitur Admin:**

- **Login Admin:** Admin login menggunakan akun yang memiliki peran 'admin'.
- **Dashboard Admin (Dasar):** Area terproteksi khusus untuk admin.
- **Manajemen Produk (CRUD):**
  - **Create:** Admin dapat menambahkan produk baru melalui form (nama, slug, deskripsi, harga, stok, kategori, URL gambar).
  - **Read:** Admin dapat melihat daftar semua produk dalam format tabel.
  - **Update:** Admin dapat mengedit detail produk yang sudah ada.
  - **Delete:** Admin dapat menghapus produk dari database.
- Semua operasi CRUD produk oleh admin langsung terhubung ke database.

## Teknologi yang Digunakan

**Frontend:**

- **React:** Library JavaScript untuk membangun antarmuka pengguna.
- **Vite:** Alat build frontend modern yang cepat.
- **Tailwind CSS:** Framework CSS utility-first untuk styling cepat dan responsif.
- **React Router DOM:** Untuk client-side routing dan navigasi antar halaman.
- **Axios:** Library untuk membuat permintaan HTTP ke backend API.
- **React Context API:** Untuk manajemen state global (status autentikasi, data keranjang).
- **react-toastify:** Untuk menampilkan notifikasi toast.
- **Lottie & Framer Motion (di Hero Section):** Untuk animasi yang menarik.
- **Heroicons (atau library ikon lainnya):** Untuk ikon di antarmuka.

**Backend:**

- **Python:** Bahasa pemrograman utama.
- **Pyramid:** Framework web Python yang fleksibel dan skalabel.
- **Waitress:** Server WSGI production-grade untuk Pyramid.
- **SQLAlchemy:** ORM (Object Relational Mapper) untuk berinteraksi dengan database.
- **psycopg2-binary:** Adapter PostgreSQL untuk Python.
- **pyramid_jwt:** Untuk implementasi autentikasi berbasis JSON Web Token (JWT).
- **passlib[bcrypt]:** Untuk hashing password yang aman.
- **CORS Handling:** Implementasi manual menggunakan Pyramid Tween (atau `pyramid-cors` jika berhasil diinstal).

**Database:**

- **PostgreSQL:** Sistem manajemen database relasional.
- **pgAdmin4 (atau `psql`):** Alat untuk mengelola database PostgreSQL.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki software berikut terinstal:

- Node.js (yang menyertakan npm atau Anda bisa menggunakan Yarn)
- Python (versi 3.8 atau lebih baru direkomendasikan)
- pip (Python package installer)
- PostgreSQL Server

## Cara Instalasi dan Setup Lokal

**1. Clone Repository (Jika Sudah Ada di GitHub):**

```bash
git clone [URL_REPOSITORY_ANDA]
cd [NAMA_FOLDER_PROYEK]
```
