from sqlalchemy import (
    Column,
    Integer,
    Text,       # Bisa juga menggunakan String jika ada batasan panjang yang jelas
    DateTime,
    Unicode,    # Alternatif untuk String/Text, baik untuk data Unicode
)
from sqlalchemy.sql import func # Untuk default timestamp
from passlib.context import CryptContext # Untuk hashing password

# Import Base dan DBSession yang sudah kita definisikan sebelumnya
# (Jika init_sqlalchemy ada di sini, pastikan Base dan DBSession didefinisikan sebelum itu)

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# from zope.sqlalchemy import register # Tidak kita gunakan lagi di setup manual ini

# Base class untuk semua model deklaratif Anda nanti
Base = declarative_base()

# Session factory (kita akan konfigurasikan bind-nya di __init__.py)
DBSession = scoped_session(sessionmaker())

def init_sqlalchemy(settings):
    """ Panggil ini dari main application 'main' function setelah settings dimuat. """
    engine = create_engine(settings['sqlalchemy.url'])
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    return engine

# --- Model User Dimulai Di Sini ---
# Konfigurasi context untuk hashing password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(Unicode(255), unique=True, nullable=False)
    email = Column(Unicode(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False) # Text untuk string panjang
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def set_password(self, password):
        """Membuat hash dari password dan menyimpannya."""
        self.password_hash = pwd_context.hash(password)

    def check_password(self, password):
        """Memverifikasi password yang diberikan dengan hash yang tersimpan."""
        return pwd_context.verify(password, self.password_hash)

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"