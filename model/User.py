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

    def get_password(self):
        """Returns the user password"""
        return self.password

    def get_email(self):
        """Returns the user email"""
        return self.email

    def get_role(self):
        """Returns the user role"""
        return self.role
