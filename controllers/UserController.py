from model.User import User
from dao.UserDAO import UserDAO
import json

userDAO = UserDAO()


def createUser(data, mongo):
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = json.loads(data.decode())["role"]

    user = User(username, password, email, role)
    userDAO.save(mongo, user.getJson())

def deleteUser(data, mongo):
    username = json.loads(data.decode())["username"]
    email = json.loads(data.decode())["email"]

    userDAO.deleteByUsernameEmail(mongo, username, email)

def getUserList(mongo):
    userList = userDAO.getAll(mongo)
    for user in userList:
        user['_id'] = str(user['_id'])

    return userList

def getUser(username, email, mongo):
    user = userDAO.getByUsernameEmail(mongo, username, email)
    print(user)
    if user:
        user['_id'] = str(user['_id'])
    return user

def modifyUser(data, mongo):
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = json.loads(data.decode())["role"]

    user = User(username, password, email, role)

    userDAO.update(mongo, user.getJson())