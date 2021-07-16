from flask import Flask, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from . import Users, users_schema
import os

basedir = os.getcwd()

app = Flask(__name__)
CORS(app)

# config
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{basedir}/dev.db"

#session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# sqlalchemy instance
db = SQLAlchemy(app)
ma = Marshmallow(app)

@app.route('/register', methods=['POST'])
def user_register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    hashed_password = generate_password_hash(password, method='sha256')
    confirmpassword = request.json['confirmpassword']

    user = Users.query.filter_by(username=username).first()
    useremail = Users.query.filter_by(email=email).first()

    if user is None and useremail is None:
        if password == confirmpassword:
            new_user = Users(username, email, hashed_password)

            db.session.add(new_user)
            db.session.commit()

            newuser = users_schema.dump(new_user)
            session['name'] = username
            return newuser

        else:
            return jsonify({"message": "Passwords don't match"})
    
    else:
        return jsonify({ "message" : "Username or email already exists" })

@app.route("/login", methods=["POST"])
def user_login():
    username = request.json['username']
    password = request.json['password']

    user = Users.query.filter_by(username=username).first()
    
    if user is not None and check_password_hash( user.password, password):
        res = users_schema.dumps(user)
        session['name'] = username
        return res
    else:
        return jsonify({"message": "Incorrect username or password"})

@app.route("/")
def index():
    pass

@app.route("/logout")
def logout():
    session["name"] = None
    return jsonify({'message':'Logged out'})

if __name__ == "__main__":
    app.run(debug=True)