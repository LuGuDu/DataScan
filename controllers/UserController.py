from flask import abort as fabort, make_response
from model.User import User
from dao.UserDAO import UserDAO
import json
import hashlib
import re

from exceptions.UserExistsException import UserExistsException
from exceptions.UserNoExistsException import UserNoExistsException
from exceptions.EmailInvalidException import EmailInvalidException
from exceptions.PasswordInvalidException import PasswordInvalidException

userDAO = UserDAO()

regexEmail = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
regexPassword = re.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,}")


def checkEmail(email):
    if(re.fullmatch(regexEmail, email)):
        return True
    else:
        return False

def checkPassword(password):
    if(re.search(regexPassword, password)):
        return True
    else:
        return False


def abort(status_code, message):
    data = {"message": message, "status_code": status_code}
    response = make_response(json.dumps(data))
    response.status_code = status_code
    response.content_type = 'application/json'
    fabort(response)


def loginUser(data, mongo):
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]

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

    try: 
        if(checkEmail(email) == False):
            raise EmailInvalidException
        if(checkPassword(password) == False):
            raise PasswordInvalidException
        if(userDAO.getByEmail(mongo,email)):
            raise UserExistsException
    except EmailInvalidException:
        print("Email not valid")        
        abort(500, "Email not valid")
    except PasswordInvalidException:
        print("Password not valid")        
        abort(500, "Password not valid")     
    except UserExistsException:
        print("User already exists")        
        abort(500, "User already exists")        

    user = User(username, password, email, role)

    userDAO.save(mongo, user.getJson())


def createUser(data, mongo):
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = json.loads(data.decode())["role"]

    try: 
        if(checkEmail(email) == False):
            raise EmailInvalidException
        if(checkPassword(password) == False):
            raise PasswordInvalidException
        if(userDAO.getByEmail(mongo,email)):
            raise UserExistsException
    except EmailInvalidException:
        print("Email not valid")        
        abort(500, "Email not valid")
    except PasswordInvalidException:
        print("Password not valid")        
        abort(500, "Password not valid")     
    except UserExistsException:
        print("User already exists")        
        abort(500, "User already exists")  

    user = User(username, password, email, role)
    userDAO.save(mongo, user.getJson())

def deleteUser(data, mongo):
    username = json.loads(data.decode())["username"]
    email = json.loads(data.decode())["email"]

    try:
        if(userDAO.getByEmail(mongo,email) is None):
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")        
        abort(500, "User doesnt exists")

    userDAO.deleteByUsernameEmail(mongo, username, email)
    

def getUserList(mongo):
    userList = userDAO.getAll(mongo)
    for user in userList:
        user['_id'] = str(user['_id'])

    return userList

def getUser(username, email, mongo):
    user = userDAO.getByUsernameEmail(mongo, username, email)
    
    try:
        if user:
            user['_id'] = str(user['_id'])
        else:
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")        
        abort(500, "User doesnt exists")

    return user

def getRole(email, mongo):
    user = userDAO.getByEmail(mongo, email)
    try:
        if user:
            if(user["role"]):
                role = "administrator"
            else:
                role = "normal"
        else:
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")        
        abort(500, "User doesnt exists")

    return role

def modifyUser(data, mongo):

    userJson = json.loads(data.decode())

    username = userJson["username"]
    email = userJson["email"]
    role = userJson["role"]

    user = userDAO.getByEmail(mongo, email) 

    try:
        if(userDAO.getByEmail(mongo,email) is None):
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")        
        abort(500, "User doesnt exists")

    if "password" in userJson:
        password = json.loads(data.decode())["password"]

        try: 
            if(checkPassword(password) == False):
                raise PasswordInvalidException
        except PasswordInvalidException:
            print("Password not valid")        
            abort(500, "Password not valid")     

        user["password"] = hashlib.sha256(password.encode()).hexdigest()

    user["username"] = username
    user["email"] = email
    user["role"] = role

    userDAO.update(mongo, user)