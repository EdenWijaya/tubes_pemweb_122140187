from setuptools import setup, find_packages

requires = [
    'pyramid~=2.0',
    'waitress',
    'psycopg2-binary',
    'SQLAlchemy',
    'alembic',
    'passlib[bcrypt]',
    'pyramid_jwt',
    # 'pyramid_cors', # Kita lewatkan dulu
    'pyramid_jinja2',
    'pyramid_sqlalchemy',
]

setup(
    name='denzshop',  # <--- GANTI INI
    version='0.0',
    description='DenzShop API Backend',
    author='Nama Anda',
    author_email='email@anda.com',
    keywords='web pyramid pylons',
    packages=find_packages(), # Ini akan menemukan package 'denzshop' Anda
    include_package_data=True,
    zip_safe=False,
    install_requires=requires,
    entry_points={
        'paste.app_factory': [
            'main = denzshop:main',  # <--- GANTI INI (merujuk ke fungsi main di denzshop/__init__.py)
        ],
    },
)