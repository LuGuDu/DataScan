class User:

    def __init__ (self, username, password, email, role):
        self.username = username
        self.password = password
        self.email = email
        self.role = role

    def getJson(self):
        return {
            'username': self.username, 
            'password': self.password, 
            'email': self.email, 
            'role': self.role
        }

    def getUsername(self):
        return self.username
    
    def getPassword(self):
        return self.password

    def getEmail(self):
        return self.email

    def getRole(self):
        return self.role
    