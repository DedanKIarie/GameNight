import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt

# Define the base directory of the application
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Get the database URL from the environment.
# This is the standard way to handle database connections in production.
database_url = os.environ.get('DATABASE_URL')

if database_url:
    # If DATABASE_URL is set (which it will be at runtime on Render), use it.
    # The .replace() is a workaround for older SQLAlchemy versions.
    DATABASE_URI = database_url.replace("postgres://", "postgresql://", 1)
else:
    # If DATABASE_URL is not set (which is the case during the build on Render
    # and for local development), fall back to a local SQLite database.
    DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'app.db')}"


metadata = MetaData(naming_convention={
    "ix": 'ix_%(column_0_label)s',
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.secret_key = b'\x9a\xec\x17\xd7\x04\x9e\x9b\r\xb2\xc2\xe0\xf4\xd9\xf2\x9e\x19'

# FIX: Add session cookie settings for cross-domain authentication
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True


db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)

# Configure CORS to allow credentials from your frontend's origin
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://gamenight-tcpy.onrender.com"}})
