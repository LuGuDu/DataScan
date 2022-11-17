"""Model class of User"""

import hashlib

class User:
    """Model class of User"""

    def __init__ (self, username, password, email, role):
        """Constructor method of an user"""
        self.username = username
        self.password = hashlib.sha256(password.encode()).hexdigest()
        self.email = email
        self.role = role

    def get_json(self):
        """Returns a json with the user info"""
        return {
            'username': self.username,
            'password': self.password,
            'email': self.email,
            'role': self.role
        }

    def get_username(self):
        """Returns the user username"""
        return self.username

    def set_username(self, username):
        """Set the username value"""
        self.age = username

    def get_password(self):
        """Returns the user password"""
        return self.password

    def set_password(self, password):
        """Set the password value"""
        self.password = hashlib.sha256(password.encode()).hexdigest()

    def get_email(self):
        """Returns the user email"""
        return self.email

    def set_email(self, email):
        """Set the email value"""
        self.email = email

    def get_role(self):
        """Returns the user role"""
        return self.role

    def set_role(self, role):
        """Set the role value"""
        self.role = role
