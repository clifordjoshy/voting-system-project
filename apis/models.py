from main import db, ma

# clear db metadata object
db.metadata.clear()


class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(50), unique = True)
    email = db.Column(db.String(100), unique = True)
    password = db.Column(db.String(100))

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

class UsersSchema(ma.Schema):
    class Meta:
        fields = ('user_id', 'username', 'email', 'password')

users_schema = UsersSchema()


class Question(db.Model):
    question_id = db.Column(db.Integer, primary_key = True)
    question_text = db.Column(db.String(100))
    question_author = db.Column(db.String(100))
    deadline = db.Column(db.DateTime)

    def __init__(self, text, author, deadline):
        self.question_text = text
        self.question_author = author
        self.deadline = deadline

class QuestionSchema(ma.Schema):
    class Meta:
        fields = ('question_id', 'question_text', 'question_author', 'deadline')

questions_schema = QuestionSchema(many=True)
question_schema = QuestionSchema()

class Choice(db.Model):
    choice_id = db.Column(db.Integer, primary_key = True)
    choice_text = db.Column(db.String(100))
    question =  db.Column(db.Integer, db.ForeignKey('question.question_id'))
    votes = db.Column(db.Integer)

    def __init__(self, text, question_id):
        self.choice_text = text
        self.question = question_id
        self.votes = 0

class ChoiceSchema(ma.Schema):
    class Meta:
        fields = ('choice_id', 'choice_text', 'question')

class ChoiceAdminSchema(ma.Schema):
    class Meta:
        fields = ('choice_id', 'choice_text', 'question', 'votes')

choices_admin_schema = ChoiceAdminSchema(many=True)

if __name__ == "__main__":
    db.create_all()
    