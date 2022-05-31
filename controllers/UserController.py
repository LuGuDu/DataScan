from model.User import User
from dao.UserDAO import UserDAO
import json
import hashlib

userDAO = UserDAO()


def loginUser(data, mongo):
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]

    #buscar si el email y la contraseña existen
    user = userDAO.getByEmail(mongo, email) 

    encryptPass = hashlib.sha256(password.encode()).hexdigest()
    if(user and encryptPass == user["password"]):
        return True

    return False


def registerUser(data, mongo):
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = False

    user = User(username, password, email, role)

    #buscar si el email ya existe

    userDAO.save(mongo, user.getJson())


def createUser(data, mongo):
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = json.loads(data.decode())["role"]

    #buscar si el email ya existe

    user = User(username, password, email, role)
    userDAO.save(mongo, user.getJson())

def deleteUser(data, mongo):
    username = json.loads(data.decode())["username"]
    email = json.loads(data.decode())["email"]

    #buscar si el email ya existe

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

    userJson = json.loads(data.decode())

    username = userJson["username"]
    email = userJson["email"]
    role = userJson["role"]

    user = userDAO.getByEmail(mongo, email) 

    if "password" in userJson:
        password = json.loads(data.decode())["password"]
        user["password"] = hashlib.sha256(password.encode()).hexdigest()

    #user = User(username, password, email, role)

    user["username"] = username
    user["email"] = email
    user["role"] = role

    #buscar si el email ya existe

    userDAO.update(mongo, user)