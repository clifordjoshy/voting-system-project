from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
import datetime
import psycopg2
# from sqlalchemy_utils.functions import database_exists

basedir = os.getcwd()

app = Flask(__name__)
CORS(app)

# config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://cdeqhteynfiarv:1e008cfbbf78966a15ca5613b7555cbffbbfa92f73d48122183409125dd183a5@ec2-54-155-208-5.eu-west-1.compute.amazonaws.com:5432/dh7pv4eklcitt"

# sqlalchemy instance
db = SQLAlchemy(app)
# if not database_exists(app.config["SQLALCHEMY_DATABASE_URI"]):
try:
    db.create_all()
except:
    pass
ma = Marshmallow(app)

app.config["JWT_SECRET_KEY"] = "super-super-secret"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = datetime.timedelta(hours=24)
jwt = JWTManager(app)