from flask import Flask, request, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from models import Users, users_schema, Question, question_schema, questions_schema, Choice, choices_schema
from main import *
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
import datetime


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

            access_token = create_access_token(identity=username)
            return jsonify(access_token=access_token)

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
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Incorrect username or password"})

@app.route("/polls", methods=['GET'])
# @jwt_required()
def index():
    polls = Question.query.all()
    polls = questions_schema.dump(polls)
    return polls

@app.route("/create_question", methods=['POST'])
@jwt_required()
def create_question():
    question_text = request.json['question_text']
    question_author = request.json['question_author']
    deadline = datetime.datetime.now()
    
    ques = Question(question_text, question_author, deadline)
    db.session.add(ques)
    db.session.commit()
    return jsonify({"question_id":f"{ques.question_id}"})

@app.route("/<id>/add_choice", methods=['POST'])
@jwt_required(id)
def add_choice():
    choice_text = request.json['choice_text']
    
    choice = Choice(choice_text, id)
    db.session.add(choice)
    db.session.commit()
    return jsonify({"choice_id":f"{choice.choice_id}"})


if __name__ == "__main__":
    app.run(debug=True)