"""UserDAO class"""

class UserDAO:
    """Class with methods for users persistance"""

    def save(self, mongo, user):
        """Takes an user and save it on mongoDB"""
        mongo.users.insert_one(user)

    def get_all(self, mongo):
        """"Returns all the users as list"""
        return list(mongo.users.find({}))

    def delete_by_username_email(self, mongo, username, email):
        """Takes an username and an email and delete the user from mongoDB"""
        mongo.users.delete_one({"username": username, "email": email})

    def get_by_username_email(self, mongo, username, email):
        """Takes an username and an email and returns the user"""
        return mongo.users.find_one({"username": username, "email": email})

    def update(self, mongo, user):
        """Takes an user and update it on mongoDB"""
        mongo.users.update_one({'email': user["email"]},
{'$set': {"username": user["username"],
"password": user["password"], "role": user["role"]}})

    def get_by_email(self, mongo, email):
        """Takes an email and returns the user from mongoDB"""
        return mongo.users.find_one({"email": email})
