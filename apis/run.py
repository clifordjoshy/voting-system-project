import datetime

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import check_password_hash, generate_password_hash

from main import *
from models import (Choice, Question, Users, choices_schema, question_schema,
                    questions_schema, users_schema, choices_admin_schema)


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
def index():
    polls = Question.query.all()
    polls = questions_schema.dump(polls)
    return jsonify({"polls":polls})

@app.route("/create_question", methods=['POST'])
@jwt_required()
def create_question():
    question_text = request.json['question_text']
    question_author = request.json['question_author']
    deadline = request.json['deadline']
    
    ques = Question(question_text, question_author, deadline)
    db.session.add(ques)
    db.session.commit()
    return jsonify({"question_id":f"{ques.question_id}"})

@app.route("/<id>/add_choice", methods=['POST'])
@jwt_required(id)
def add_choice(id):
    choice_text = request.json['choice_text']
    
    choice = Choice(choice_text, id)
    db.session.add(choice)
    db.session.commit()
    return jsonify({"choice_id":f"{choice.choice_id}"})

@app.route("/<id>", methods=['POST','GET'])
def question(id):
    if request.method == 'POST':
        voted_choice = request.json['choice_id']
        choice = Choice.query.filter_by(choice_id=voted_choice).first()
        choice.votes = choice.votes + 1
        db.session.commit()
        return jsonify({"voted for choice_id":f"{choice.choice_id}"})

    else:
        ques = Question.query.filter_by(question_id=id).first()
        choices = Choice.query.filter_by(question=id).all()
        ques = question_schema.dump(ques)
        choices = choices_schema.dump(choices)
        print(ques)
        print(choices)
        return jsonify({"question":ques, "choices":choices})

@app.route("/<id>/admin", methods=['POST', 'GET'])
@jwt_required()
def question_admin(id):
    if request.method == 'POST':
        ques = Question.query.filter_by(question_id=id).first()
        ques.question_text = request.json['question_text']
        ques.question_author = request.json['question_author']
        ques.deadline = request.json['deadline']
        db.session.commit()
        return jsonify({"msg":"updated"})

    else:
        ques = Question.query.filter_by(question_id=id).first()
        choices = Choice.query.filter_by(question=id).all()
        ques = question_schema.dump(ques)
        choices = choices_admin_schema.dump(choices)
        print(ques)
        print(choices)
        return jsonify({"question":ques, "choices":choices})


if __name__ == "__main__":
    app.run(debug=True)
