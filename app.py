from flask import Flask, request
from flask_pymongo import PyMongo
import controllers.MachineLearningController as ml
import controllers.UserController as userController
import json

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://admin:oYnyQDS4UcMqyoLA@clusterdatascan.gozlc.mongodb.net/datascan"
mongodb_client = PyMongo(app)
mongo = mongodb_client.db


@app.route('/getModelData', methods=['GET'])
def getModelData():
    if request.method == "GET":
        modelInfo = ml.getModelInfo(mongo)
        return {"message": 200, "modelInfo": modelInfo}
    
    return {"message": 500}


@app.route('/getTrainModelHistory', methods=['GET'])
def getTrainModelHistory():
    if request.method == "GET":
        modelHistory = ml.getTrainModelHistory(mongo)
        return {"message": 200, "modelHistory": modelHistory}
    
    return {"message": 500}


@app.route('/checkModel', methods=['POST'])
def checkModel():

    if request.method == "POST":
        if request.files:
            file = request.files["file"]

            accuracy = ml.checkModel(file, mongo)

            return {"message": 200, "accuracy": accuracy}

    return {"message": 500}


@app.route('/analyze', methods=['POST'])
def analyze():

    if request.method == "POST":
        if request.files:
            file = request.files["file"]         
            predicts = ml.predict(file, mongo)
            return {"message" : 200, "predicts" : predicts}

    return {"message": 500}
    

#un metodo para subir el archivo, de ahi se creará el modelo auxiliar (post) tambien guardara el data en un fichero auxiliar
@app.route('/setFile', methods=['POST'])
def trainAux():
    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            accuracy, predictors = ml.trainAuxModel(file)
            return {"message" : 200, "accuracy" : accuracy, "predictors": predictors}
    
    return {"message": 500}

#un metodo para recibir los predictores y su importancia del modelo auxiliar (get)
@app.route('/setPredictors', methods=['POST'])
def setPredictors():
    if request.method == "POST":
        predictors = json.loads(request.data.decode())["predictors"]
        accuracy = ml.checkPredictors(predictors)
        return {"message": 200, "accuracy" : accuracy}
    
    return {"message": 500}

#un metodo para actualizar los predictores del modelo auxiliar (post)
@app.route('/prunning', methods=['GET', 'POST'])
def getPrunningInfo():
    if request.method == "GET":
        accuracy = ml.getPrunningAccuracy()
        return {"message": 200, "accuracy" : accuracy}
    return {"message": 500}


#un metodo para entrenar el modelo final
@app.route('/finishModelTrain', methods=[ 'POST'])
def finishModelTrain():
    if request.method == "POST":
        prunning = json.loads(request.data.decode())["prunning"]
        ml.finalTrainModel(prunning, mongo)

        return {"message": 200}
    return {"message": 500}


@app.route('/registerUser', methods=['POST'])
def registerUser():
    if request.method == "POST":
        userController.registerUser(request.data, mongo)
        return {"message": 200}
    
    return {"message": 500}


@app.route('/createUser', methods=['POST'])
def createUser():
    if request.method == "POST":
        userController.createUser(request.data, mongo)
        return {"message": 200}
    
    return {"message": 500}

@app.route('/getUsers', methods=['GET'])
def getUsers():
    if request.method == "GET":
        userList = userController.getUserList(mongo)
        return {"message": 200, "users": userList}
    return {"message": 500}

@app.route('/deleteUser', methods=['DELETE'])
def deleteUser():
    if request.method == 'DELETE':
        userController.deleteUser(request.data, mongo)
        return {"message": 200}
    return {"message": 500}

@app.route('/getUser', methods=['GET'])
def getUser():
    if request.method == "GET":
        username = request.args.get('username')
        email = request.args.get('email')
        user = userController.getUser(username, email, mongo)
        return {"message": 200, "user": user}
    return {"message": 500}


@app.route('/modifyUser', methods=['PUT'])
def modifyUser():
    if request.method == "PUT":
        userController.modifyUser(request.data, mongo)
        return {"message": 200}
    return {"message": 500}


if __name__ == '__main__':
    app.run()
