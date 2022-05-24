from flask import Flask, request
from flask_pymongo import PyMongo
import smtplib
import pandas as pd
import modules.mLMethods as ml
import json


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://admin:oYnyQDS4UcMqyoLA@clusterdatascan.gozlc.mongodb.net/datascan"
mongodb_client = PyMongo(app)
mongo = mongodb_client.db


@app.route('/sendMessage', methods=['POST'])
def sendEmail():

    from email.mime.text import MIMEText

    if request.method == "POST":

        name = request.json['emailName']
        subject = request.json['emailSubject']
        message =  MIMEText(name + "\n" + request.json['emailMessage'])

        message['Subject'] = subject
        message['From'] = "datascan.contacto@gmail.com"
        message['To'] = "datascan.contacto@gmail.com"

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login("datascan.contacto@gmail.com", "datascan2122")
        server.sendmail("datascan.contacto@gmail.com", "datascan.contacto@gmail.com", message.as_string())

        print("Successfully sent email")

        return {"message": 200}
    
    return {"message": 500}


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


@app.route('/train', methods=['POST'])
def training():

    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            data = pd.read_csv(file)

            #Debe hacerse antes de la normalizacion para obtener los nombres
            attackList = list(dict.fromkeys(sorted(data['class'])))

            fileData = {'fileName':file.filename, 'attackList': attackList}

            data = ml.cleanData(data)
            ml.train(data, fileData, mongo)

            return {"message" : 200}

    return {"message": 500}


@app.route('/checkModel', methods=['POST'])
def checkModel():

    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            data = pd.read_csv(file)
            data = ml.cleanData(data)
            accuracy = ml.checkModel(data)

            return {"message": 200, "accuracy": accuracy}

    return {"message": 500}


@app.route('/analyze', methods=['POST'])
def analyze():

    if request.method == "POST":
        if request.files:
            file = request.files["file"]
            data = pd.read_csv(file)

            dataForPredict = ml.cleanData(data)
            predicts = ml.predict(dataForPredict, mongo)

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
        accuracy = ml.getPrunningAccuracy()
        return {"message": 200, "accuracy" : accuracy}
    return {"message": 500}


if __name__ == '__main__':
    app.run()
