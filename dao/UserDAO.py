from re import A
from model.User import User

class UserDAO:

    def save(self, mongo, user):
        mongo.users.insert_one(user)

    def getAll(self, mongo):
        return list(mongo.users.find({}))

    def deleteByUsernameEmail(self, mongo, username, email):
        mongo.users.delete_one({"username": username, "email": email})

    def getByUsernameEmail(self, mongo, username, email):
        return mongo.users.find_one({"username": username, "email": email})

    def update(self, mongo, user):
        print(user)
        mongo.users.update_one({'email': user["email"]}, {'$set': {"username": user["username"], "password": user["password"], "role": user["role"]}})

    def getByEmail(self, mongo, email):
        return mongo.users.find_one({"email": email})