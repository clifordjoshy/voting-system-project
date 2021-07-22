import datetime

from flask import jsonify, request
from flask_jwt_extended import (create_access_token, get_jwt_identity,
                                jwt_required)
from werkzeug.security import check_password_hash, generate_password_hash

from main import *
from models import (Choice, Question, Users, choices_schema, question_schema,
                    questions_schema, users_schema, choices_admin_schema)

from flask_cors import cross_origin

from main import db
db.create_all()

@app.route('/register', methods=['POST'])
@cross_origin()
def user_register():
    try:
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']
        hashed_password = generate_password_hash(password, method='sha256')
        confirmpassword = request.json['confirmpassword']
    except KeyError:
        return jsonify({"msg":"One or more fields are empty."})

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
@cross_origin()
def user_login():
    try:
        username = request.json['username']
        password = request.json['password']
    except KeyError:
        return jsonify({"msg":"One or more fields are empty."})

    user = Users.query.filter_by(username=username).first()
    
    if user is not None and check_password_hash( user.password, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    else:
        return jsonify({"message": "Incorrect username or password"})

@app.route("/all_questions", methods=['GET'])
@cross_origin()
def index():
    polls = Question.query.all()
    polls = questions_schema.dump(polls)
    return jsonify({"all_questions":polls})

@app.route("/questions", methods=['GET'])
@cross_origin()
@jwt_required()
def user_questions():
    user = Users.query.filter_by(username=get_jwt_identity()).first().user_id
    polls = Question.query.filter_by(question_author=user)
    polls = questions_schema.dump(polls)
    return jsonify({"questions":polls})

@app.route("/create_question", methods=['POST'])
@cross_origin()
@jwt_required()
def create_question():
    question_text = request.json['question_text']
    question_author = Users.query.filter_by(username=get_jwt_identity()).first().user_id
    deadline = datetime.datetime.strptime(request.json['deadline'], '%Y-%m-%dT%H:%M:%S.%fZ')
    choices = request.json['choices']
    
    ques = Question(question_text, question_author, deadline)
    db.session.add(ques)
    db.session.commit()
    for choice_text in choices:
        choice = Choice(choice_text, ques.question_id)
        db.session.add(choice)
        db.session.commit()
    return jsonify({"question_id":f"{ques.question_id}"})

@app.route("/<id>/add_choice", methods=['POST'])
@cross_origin()
@jwt_required(id)
def add_choice(id):
    choice_text = request.json['choice_text']
    
    choice = Choice(choice_text, id)
    db.session.add(choice)
    db.session.commit()
    return jsonify({"choice_id":f"{choice.choice_id}"})

@app.route("/<id>/delete_choice", methods=['POST'])
@cross_origin()
@jwt_required(id)
def delete_choice(id):   
    choice_id = request.json['choice_id']
    choice = Choice.query.filter_by(choice_id=choice_id).first()
    db.session.delete(choice)
    db.session.commit()
    return jsonify({"deleted choice_id":f"{choice.choice_id}"})

#post:vote, get:info
@app.route("/<id>", methods=['POST','GET'])
@cross_origin()
def question(id):
    ques = Question.query.filter_by(question_id=id).first()
    if ques is None:
        return jsonify({"msg":"Question does not exist."})
    if request.method == 'POST':
        if ques.deadline < datetime.datetime.now():
            ques = question_schema.dump(ques)
            return jsonify({"question":ques, "msg":"Deadline has passed."})
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
        return jsonify({"question":ques, "choices":choices})

#post:update, get:vote count
@app.route("/<id>/admin", methods=['POST', 'GET'])
@cross_origin()
@jwt_required()
def question_admin(id):
    ques = Question.query.filter_by(question_id=id).first()
    if ques.question_author == Users.query.filter_by(username=get_jwt_identity()).first().user_id:
        if request.method == 'POST':
            ques.question_text = request.json['question_text']
            ques.deadline = request.json['deadline']
            choices_add = request.json['choices_created']
            choices_update = request.json['choices_edited']
            db.session.commit()
            for choice in choices_add:
                choice = Choice(choice['choice_text'], ques.question_id)
                db.session.add(choice)
                db.session.commit()
            for choice in choices_update:
                choice_entry = Choice.query.filter_by(choice_id=choice['choice_id']).first()
                choice_entry.choice_text = choice['choice_text']
                db.session.commit()
            return jsonify({"msg":"updated"})

        else:
            choices = Choice.query.filter_by(question=id).all()
            ques = question_schema.dump(ques)
            choices = choices_admin_schema.dump(choices)
            return jsonify({"question":ques, "choices":choices})
    else:
        return jsonify({"msg":"This question was posted by a different user."})


if __name__ == "__main__":
    app.run(debug=True)