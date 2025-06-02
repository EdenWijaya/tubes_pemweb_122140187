from sqlalchemy import (
    Column,
    Integer,
    Text,       
    DateTime,
    Unicode,    
    String,
)
from sqlalchemy.sql import func # Untuk default timestamp
from passlib.context import CryptContext # Untuk hashing password

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Product(Base):
    __tablename__ = 'products'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False) 
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    short_description = Column(String(255))
    price = Column(Integer, nullable=False) 
    stock_quantity = Column(Integer, nullable=False, default=0)
    category = Column(String(100))
    image_url = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now()) 

    def __repr__(self):
        return f"<Product(name='{self.name}', price='{self.price}')>"

DBSession = scoped_session(sessionmaker())

def init_sqlalchemy(settings):
    """ Panggil ini dari main application 'main' function setelah settings dimuat. """
    engine = create_engine(settings['sqlalchemy.url'])
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    return engine

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(Unicode(255), unique=True, nullable=False)
    email = Column(Unicode(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    role = Column(String(50), default='user', nullable=False)

    def set_password(self, password):
        """Membuat hash dari password dan menyimpannya."""
        self.password_hash = pwd_context.hash(password)

    def check_password(self, password):
        """Memverifikasi password yang diberikan dengan hash yang tersimpan."""
        return pwd_context.verify(password, self.password_hash)

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"