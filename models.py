from . import db, ma

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