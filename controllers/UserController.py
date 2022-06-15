"""User controller class"""

import json
import hashlib
import re
from flask import abort as fabort, make_response

from model.User import User
from dao.UserDAO import UserDAO

from exceptions.UserExistsException import UserExistsException
from exceptions.UserNoExistsException import UserNoExistsException
from exceptions.EmailInvalidException import EmailInvalidException
from exceptions.PasswordInvalidException import PasswordInvalidException

user_dao = UserDAO()

regex_email = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
regex_password = re.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!#%*?&]{8,}")


def check_email(email):
    """Method to verify the email"""
    if re.fullmatch(regex_email, email):
        return True

def check_password(password):
    """Method to verify the password"""
    if re.search(regex_password, password):
        return True


def abort(status_code, message):
    """Method to abort the request"""
    data = {"message": message, "status_code": status_code}
    response = make_response(json.dumps(data))
    response.status_code = status_code
    response.content_type = 'application/json'
    fabort(response)


def login_user(data, mongo):
    """Method to login an user"""
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]

    user = user_dao.get_by_email(mongo, email)

    encrypt_pass = hashlib.sha256(password.encode()).hexdigest()
    if user and encrypt_pass == user["password"]:
        return True

    return False


def register_user(data, mongo):
    """Method to register a new user"""
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = False

    try:
        if check_email(email) is False:
            raise EmailInvalidException
        if check_password(password) is False:
            raise PasswordInvalidException
        if user_dao.get_by_email(mongo,email):
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

    user_dao.save(mongo, user.get_json())


def create_user(data, mongo):
    """Method to create a new user"""
    username = json.loads(data.decode())["username"]
    password = json.loads(data.decode())["password"]
    email = json.loads(data.decode())["email"]
    role = json.loads(data.decode())["role"]

    try:
        if check_email(email) is False:
            raise EmailInvalidException
        if check_password(password) is False:
            raise PasswordInvalidException
        if user_dao.get_by_email(mongo,email):
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
    user_dao.save(mongo, user.get_json())

def delete_user(data, mongo):
    """Method to delete an existing user"""
    username = json.loads(data.decode())["username"]
    email = json.loads(data.decode())["email"]

    try:
        if user_dao.get_by_email(mongo,email) is None:
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")
        abort(500, "User doesnt exists")

    user_dao.delete_by_username_email(mongo, username, email)


def get_user_list(mongo):
    """Method to obtains the users list"""
    user_list = user_dao.get_all(mongo)
    for user in user_list:
        user['_id'] = str(user['_id'])
    return user_list

def get_user(username, email, mongo):
    """Method to obtains the info of an user"""
    user = user_dao.get_by_username_email(mongo, username, email)

    try:
        if user:
            user['_id'] = str(user['_id'])
        else:
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")
        abort(500, "User doesnt exists")

    return user

def get_role(email, mongo):
    """Method to obtains the role of an user"""
    user = user_dao.get_by_email(mongo, email)
    try:
        if user:
            if user["role"]:
                role = "administrator"
            else:
                role = "normal"
        else:
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")
        abort(500, "User doesnt exists")

    return role

def modify_user(data, mongo):
    """Method to modify an existing user"""
    user_json = json.loads(data.decode())

    username = user_json["username"]
    email = user_json["email"]
    role = user_json["role"]

    user = user_dao.get_by_email(mongo, email)

    try:
        if user_dao.get_by_email(mongo,email) is None:
            raise UserNoExistsException
    except UserNoExistsException:
        print("User doesnt exists")
        abort(500, "User doesnt exists")

    if "password" in user_json:
        password = json.loads(data.decode())["password"]

        try:
            if check_password(password) is False:
                raise PasswordInvalidException
        except PasswordInvalidException:
            print("Password not valid")
            abort(500, "Password not valid")

        user["password"] = hashlib.sha256(password.encode()).hexdigest()

    user["username"] = username
    user["email"] = email
    user["role"] = role

    user_dao.update(mongo, user)
