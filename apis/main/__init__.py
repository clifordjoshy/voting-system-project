from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import datetime

basedir = os.getcwd()

app = Flask(__name__)
CORS(app)

# config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{basedir}/dev.db"

# sqlalchemy instance
db = SQLAlchemy(app)
ma = Marshmallow(app)

app.config["JWT_SECRET_KEY"] = "super-super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)
jwt = JWTManager(app)