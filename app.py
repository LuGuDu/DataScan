"""Main file of the Flask application"""

import json
from flask import Flask, request, send_from_directory
from flask_pymongo import PyMongo
from flask_cors import CORS, cross_origin
import controllers.MachineLearningController as ml
import controllers.UserController as userController


app = Flask(__name__, static_folder='frontend/build', static_url_path='')
CORS(app)
MONGO_STRING = "mongodb+srv://admin:oYnyQDS4UcMqyoLA@clusterdatascan.gozlc.mongodb.net/datascan"
app.config["MONGO_URI"] = MONGO_STRING
mongodb_client = PyMongo(app)
mongo = mongodb_client.db

@app.route('/getModelData', methods=['GET'])
@cross_origin()
def get_model_data():
    """Method to obtain the model data"""
    if request.method == "GET":
        model_info = ml.get_model_info(mongo)
        return {"message": 200, "modelInfo": model_info}

    return {"message": 500}


@app.route('/getModelFormat', methods=['GET'])
@cross_origin()
def get_model_format():
    """Method to obtain the model format, the columns"""
    if request.method == "GET":
        model_format = ml.get_model_format(mongo)
        return {"message": 200, "modelFormat": model_format}

    return {"message": 500}


@app.route('/getTrainModelHistory', methods=['GET'])
@cross_origin()
def get_train_model_history():
    """Method to obtain the model train history"""
    if request.method == "GET":
        model_history = ml.get_train_model_history(mongo)
        return {"message": 200, "modelHistory": model_history}

    return {"message": 500}


@app.route('/checkModel', methods=['POST'])
@cross_origin()
def check_model():
    """Method to check the actual train model"""
    if request.method == "POST":
        if request.files:
            file = request.files["file"]

            extra_attacks_list, accuracy = ml.check_model(file, mongo)

            return {"message": 200, "accuracy": accuracy, "extraAttacks": extra_attacks_list}

    return {"message": 500}


@app.route('/analyze', methods=['POST'])
@cross_origin()
def analyze():
    """Method to analyze a dataset with the actual model"""
    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            predicts = ml.predict(file, mongo)
            return {"message" : 200, "predicts" : predicts}

    return {"message": 500}


@app.route('/setFile', methods=['POST'])
@cross_origin()
def train_aux():
    """Method to train an auxiliar model"""
    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            accuracy, predictors = ml.train_aux_model(file)
            return {"message" : 200, "accuracy" : accuracy, "predictors": predictors}

    return {"message": 500}


@app.route('/setPredictors', methods=['POST'])
@cross_origin()
def set_predictors():
    """Method to set the predictors of the auxiliar model"""
    if request.method == "POST":
        predictors = json.loads(request.data.decode())["predictors"]
        accuracy = ml.check_predictors(predictors)
        return {"message": 200, "accuracy" : accuracy}

    return {"message": 500}


@app.route('/prunning', methods=['GET', 'POST'])
@cross_origin()
def get_prunning_info():
    """Method to check the pruning of the tree"""
    if request.method == "GET":
        accuracy = ml.get_prunning_accuracy()
        return {"message": 200, "accuracy" : accuracy}
    return {"message": 500}


@app.route('/finishModelTrain', methods=[ 'POST'])
@cross_origin()
def finish_model_train():
    """Method to train the final model"""
    if request.method == "POST":
        prunning = json.loads(request.data.decode())["prunning"]
        ml.final_train_model(prunning, mongo)

        return {"message": 200}
    return {"message": 500}


@app.route('/loginUser', methods=['POST'])
@cross_origin()
def login_user():
    """Method to login an user to the system"""
    if request.method == "POST":
        login = userController.login_user(request.data, mongo)
        return {"message": 200, "login": login}

    return {"message": 500}


@app.route('/registerUser', methods=['POST'])
@cross_origin()
def register_user():
    """Method to registry an user to the system"""
    if request.method == "POST":
        userController.register_user(request.data, mongo)
        return {"message": 200}

    return {"message": 500}


@app.route('/createUser', methods=['POST'])
@cross_origin()
def create_user():
    """Method to create a new user"""
    if request.method == "POST":
        userController.create_user(request.data, mongo)
        return {"message": 200}

    return {"message": 500}

@app.route('/getUsers', methods=['GET'])
@cross_origin()
def get_users():
    """Method to obtain a list of all users"""
    if request.method == "GET":
        user_list = userController.get_user_list(mongo)
        return {"message": 200, "users": user_list}
    return {"message": 500}

@app.route('/deleteUser', methods=['DELETE'])
@cross_origin()
def delete_user():
    """Method to delete an user"""
    if request.method == 'DELETE':
        userController.delete_user(request.data, mongo)
        return {"message": 200}
    return {"message": 500}


@app.route('/getUser', methods=['GET'])
@cross_origin()
def get_user():
    """Method to obtain the info of an user"""
    if request.method == "GET":
        username = request.args.get('username')
        email = request.args.get('email')
        user = userController.get_user(username, email, mongo)
        return {"message": 200, "user": user}
    return {"message": 500}


@app.route('/getRole', methods=['GET'])
@cross_origin()
def get_role():
    """Method to obtain the role of an user"""
    if request.method == "GET":
        email = request.args.get('email')
        role = userController.get_role(email, mongo)
        return {"message": 200, "role": role}
    return {"message": 500}


@app.route('/modifyUser', methods=['PUT'])
@cross_origin()
def modify_user():
    """Method to modify an existing user"""
    if request.method == "PUT":
        userController.modify_user(request.data, mongo)
        return {"message": 200}
    return {"message": 500}


@app.route('/')
@cross_origin()
def serve():
    """Method to charge the main page of the server app"""
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run()
