from app import app
import pytest
import json

def test_success_login():
    data = {
                "email": "lucas", 
                "password": "asdf"
            }

    response = app.test_client().post(
            "/loginUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert res['login'] == True

def test_failed_login():
    data = {
                "email": "123", 
                "password": "123"
            }

    response = app.test_client().post(
            "/loginUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert res['login'] == False


def test_failed_register_bad_email():
    data = {
                "email": "978", 
                "username": "123", 
                "password": "123"
            }

    response = app.test_client().post(
            "/registerUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "Email not valid"

def test_failed_register_bad_password():
    data = {
                "email": "test@TEST2.com", 
                "username": "test@TEST2.com", 
                "password": "asdf"
            }

    response = app.test_client().post(
            "/registerUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "Password not valid"

@pytest.mark.run(order=1)
def test_success_register():
    data = {
                "email": "test@TEST1.COM", 
                "username": "test@TEST1.COM", 
                "password": "test@TEST1.COM"
            }

    response = app.test_client().post(
            "/registerUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 200

@pytest.mark.run(order=2)
def test_failed_register_user_exists():
    data = {
                "email": "test@TEST1.COM", 
                "username": "lucas", 
                "password": "test@TEST1.COM"
            }

    response = app.test_client().post(
            "/registerUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "User already exists"

def test_failed_delete_user():
    data = {
                "email": "123", 
                "username": "test@TEST1.COM", 
                "password": "test@TEST1.COM"
            }

    response = app.test_client().delete(
            "/deleteUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))

    assert response.status_code == 500
    assert res["message"] == "User doesnt exists"


def test_success_get_users():
    response = app.test_client().get("/getUsers")
    assert response.status_code == 200


def test_failed_get_user():

    response = app.test_client().get(
            "/getUser?username=test@TEST3.COM&email=test@TEST3.COM",
        )
    res = json.loads(response.data.decode('utf-8'))

    assert response.status_code == 500
    assert res["message"] == "User doesnt exists"

@pytest.mark.run(order=3)
def test_success_get_user():
    response = app.test_client().get(
            "/getUser?username=test@TEST1.COM&email=test@TEST1.COM",
        )
    assert response.status_code == 200

def test_failed_get_role_user():

    response = app.test_client().get(
            "/getRole?email=test@TEST3.COM",
        )
    res = json.loads(response.data.decode('utf-8'))

    assert response.status_code == 500
    assert res["message"] == "User doesnt exists"

@pytest.mark.run(order=3)
def test_success_get_role_user():
    response = app.test_client().get(
            "/getRole?email=test@TEST1.COM",
        )

    assert response.status_code == 200



def test_failed_create_bad_email():
    data = {
                "email": "978", 
                "username": "123", 
                "password": "123",
                "role": True
            }

    response = app.test_client().post(
            "/createUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "Email not valid"

def test_failed_create_bad_password():
    data = {
                "email": "test@TEST2.com", 
                "username": "test@TEST2.com", 
                "password": "asdf",
                "role": True
            }

    response = app.test_client().post(
            "/createUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "Password not valid"

@pytest.mark.run(order=4)
def test_success_create():
    data = {
                "email": "test@TEST2.COM", 
                "username": "test@TEST2.COM", 
                "password": "test@TEST2.COM",
                "role": True
            }

    response = app.test_client().post(
            "/createUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    
    assert response.status_code == 200

@pytest.mark.run(order=5)
def test_failed_create_user_exists():
    data = {
                "email": "test@TEST2.COM", 
                "username": "lucas", 
                "password": "test@TEST1.COM",
                "role": True
            }

    response = app.test_client().post(
            "/createUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "User already exists"



def test_failed_modify_user_exists():
    data = {
                "email": "test@TEST6.COM", 
                "username": "lucas", 
                "password": "test@TEST1.COM",
                "role": True
            }

    response = app.test_client().put(
            "/modifyUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "User doesnt exists"



@pytest.mark.run(order=6)
def test_failed_modify_user_bad_password():
    data = {
                "email": "test@TEST2.COM", 
                "username": "lucas", 
                "password": "asdf",
                "role": True
            }

    response = app.test_client().put(
            "/modifyUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "Password not valid"


@pytest.mark.run(order=7)
def test_success_modify_user():
    data = {
                "email": "test@TEST2.COM", 
                "username": "lucas123", 
                "password": "test@TEST2.COMmodify",
                "role": False
            }

    response = app.test_client().put(
            "/modifyUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    
    assert response.status_code == 200



@pytest.mark.run(order=8)
def test_success_delete_user1():
    data = {
                "email": "test@TEST2.COM", 
                "username": "lucas123"
            }

    response = app.test_client().delete(
            "/deleteUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    assert response.status_code == 200

@pytest.mark.run(order=9)
def test_success_delete_user2():
    data = {
                "email": "test@TEST1.COM", 
                "username": "test@TEST1.COM"
            }

    response = app.test_client().delete(
            "/deleteUser",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    assert response.status_code == 200