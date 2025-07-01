import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_bcrypt import Bcrypt


BASE_DIR = os.path.abspath(os.path.dirname(__file__))


DATA_DIR = '/var/data'


DATABASE_URI = os.environ.get('DATABASE_URL').replace("postgres://", "postgresql://", 1) if os.environ.get('DATABASE_URL') else f"sqlite:///{os.path.join(DATA_DIR, 'app.db')}"

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

db = SQLAlchemy(app, metadata=metadata)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app)
api = Api(app)


CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://gamenight-tcpy.onrender.com"}})
