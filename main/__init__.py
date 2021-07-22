from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import datetime
from sqlalchemy import create_engine
from sqlalchemy_utils import database_exists,create_database

def validate_database():
     engine = create_engine('postgres://postgres@localhost/name')
     if not database_exists(engine.url): # Checks for the first time  
         create_database(engine.url)     # Create new DB    
         print("New Database Created"+database_exists(engine.url)) # Verifies if database is there or not.
     else:
         print("Database Already Exists")

basedir = os.getcwd()

app = Flask(__name__)
CORS(app)

# config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{basedir}/dev.db"

# sqlalchemy instance
db = SQLAlchemy(app)
validate_database()
ma = Marshmallow(app)

app.config["JWT_SECRET_KEY"] = "super-super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)
jwt = JWTManager(app)