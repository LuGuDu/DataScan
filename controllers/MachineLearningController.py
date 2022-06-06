from fileinput import filename
import pickle, time
import pandas as pd
import numpy as np

from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from datetime import datetime

from model.ModelRegistry import ModelRegistry
from dao.ModelRegistryDAO import ModelRegistryDAO

modelRegistryDAO = ModelRegistryDAO()


def saveModel(model, fileName):
    # serializar nuestro modelo y salvarlo en el fichero area_model.pickle
    with open("models/" + fileName, "wb") as file:
        pickle.dump(model, file)
    print ("MODELO GUARDADO")


def loadModel(fileName):
    with open('models/' + fileName, "rb") as file:
        modelLoad = pickle.load(file)
    print("MODELO CARGADO")
    return modelLoad


def normalizeData(data):
    le = LabelEncoder()

    #Pasar los datos no numericos a valores numericos
    for col_name in data.columns:
        if data[col_name].dtype == object:
            data[col_name] = le.fit_transform(data[col_name])

    if 'class' in data.columns:
        data['class'] = data.pop('class')

    return data

#este hay que trnasformarlo, hay que settear las columnas que tenga el modelo si o si
def cleanData(data, mongo):

    columns = mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["columns"]

    data = normalizeData(data)

    #Seleccionar unicamente las columnas mas relevantes para el modelo
    newData = pd.DataFrame()

    for col_name in columns:
        if col_name == 'class':
            continue
        else:
            newData[col_name] = data[col_name]
    
    if 'class' in data.columns:
        newData['class'] = data['class']

    print('DATOS LIMPIADOS')
    return newData


def cleanDataPredictors(data, predictorsList):

    newData = pd.DataFrame()
    #para cada elemento de la lsita de predictorsList hacer new data...
    for column in predictorsList:
        if column != 'class':
            newData[column] = data[column]
    
    if 'class' in data.columns:
        newData['class'] = data['class']

    return newData


def checkAccuracy(model, X_test, y_test):
    from sklearn.metrics import accuracy_score
    preds = model.predict(X_test)
    score = accuracy_score(y_test, preds)
    print("El Accuracy del modelo es: ", score)
    return score


def trainAuxModel(file):
    data = pd.read_csv(file)
    data.to_csv('models/dataTrain.csv', encoding='utf-8', index=False)
    f = open("models/fileName.txt", "w")
    f.write(file.filename)

    data = normalizeData(data)

    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)
      
    modelDT = DecisionTreeClassifier(random_state=1)
    modelDT.fit(X_train, y_train)
    accuracy = checkAccuracy(modelDT, X_test, y_test)

    importancia_predictores = pd.DataFrame({'predictor': X.columns,
        'importancia': modelDT.feature_importances_}).sort_values('importancia', ascending=False)

    return accuracy, importancia_predictores.to_json(orient = 'records')


def checkPredictors(predictors):
    data = pd.read_csv('models/dataTrain.csv')
    data = normalizeData(data)
    data = cleanDataPredictors(data, predictors)
    data.to_csv('models/dataTrainNewPredictors.csv', encoding='utf-8', index=False)

    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)
      
    modelDT = DecisionTreeClassifier(random_state=1)
    modelDT.fit(X_train, y_train)
    accuracy = checkAccuracy(modelDT, X_test, y_test)

    return accuracy


def getPrunningAccuracy():
    data = pd.read_csv('models/dataTrainNewPredictors.csv')

    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)
      
    improvedModelDT = improveModel(X_train, y_train)

    accuracy = checkAccuracy(improvedModelDT, X_test, y_test)

    return accuracy


def finalTrainModel(prunning, mongo):
    data = pd.read_csv('models/dataTrainNewPredictors.csv')

    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)

    beginTime = 0
    finalTime = 0

    modelDT = ""

    if(prunning): 
        beginTime = time.time()
        modelDT = improveModel(X_train, y_train)
    else:
        beginTime = time.time()
        modelDT = normalModel(X_train, y_train)
    
    finalTime = time.time()
    timeTraining = finalTime-beginTime
    
    accuracy = checkAccuracy(modelDT, X_test, y_test)

    saveModel(modelDT, "modeloEntrenado.pickle")

    f = open("models/fileName.txt", "r")
    fileName = f.read()
    f.close()
    dataOriginal = pd.read_csv('models/dataTrain.csv')

    #Debe hacerse antes de la normalizacion para obtener los nombres
    attackList = list(dict.fromkeys(sorted(dataOriginal['class'])))
    #fileData = {'fileName':fileName, 'attackList': attackList}

    rows = data.shape[0]
    columns = data.columns.values.tolist()

    modelRegistry = ModelRegistry(fileName, datetime.now(), timeTraining, prunning, accuracy, rows, columns, attackList)

    modelRegistryDAO.save(modelRegistry.getJson(), mongo)

    #delete aux files
    import os
    os.remove("models/dataTrain.csv")
    os.remove("models/dataTrainNewPredictors.csv")
    os.remove("models/fileName.txt")


def normalModel(X_train, y_train):
    modelDT = DecisionTreeClassifier(random_state=1)
    modelDT.fit(X_train, y_train)
    return modelDT


def improveModel(X_train, y_train):
    from sklearn.model_selection import GridSearchCV

    param_grid = {'ccp_alpha': np.linspace(0, 5, 10)}

    # Búsqueda por validación cruzada
    grid = GridSearchCV(
        # El árbol se crece al máximo posible antes de aplicar el pruning
        estimator = DecisionTreeClassifier(
                            max_depth= None,
                            min_samples_split= 2,
                            min_samples_leaf = 1,
                            random_state= 123
                       ),
        param_grid = param_grid,
        scoring    = 'accuracy',
        cv         = 10,
        refit      = True,
        return_train_score = True
    )
    grid.fit(X_train, y_train)

    improvedModel = grid.best_estimator_
    # print(f"Profundidad del árbol: {improvedModel.get_depth()}")
    # print(f"Número de nodos terminales: {improvedModel.get_n_leaves()}")

    return improvedModel


def getModelFormat(mongo):
    modelFormat = list(modelRegistryDAO.getLastColumnsList(mongo))
    return modelFormat


def getModelInfo(mongo):
    modelInfo = modelRegistryDAO.getLastRegistry(mongo)
    modelInfo.pop('_id', None)
    return modelInfo


def getTrainModelHistory(mongo):
    modelHistory = list(modelRegistryDAO.getAllRegistry(mongo))
    
    for element in modelHistory:
        element.pop('_id', None)
        element.pop('modelFileName', None)
        element.update({'accuracy': str(round(element['accuracy'],4))})
        element.update({'timeTraining': str(round(element['timeTraining'],2))})
        element.update({'date': str(element['date'])})
    
    return modelHistory


def cleanExtraClasses(data, mongo):
    attacks = list(modelRegistryDAO.getLastAttackList(mongo))

    extra_attacks = []

    for row in data.iterrows():
        if (row[1]['class'] not in attacks):
            extra_attacks.append(row[1]['class'])
            data = data.drop(row[0])

    extra_attacks_list = list(dict.fromkeys(extra_attacks))

    return extra_attacks_list, data


def checkModel(file, mongo):
    from sklearn.metrics import accuracy_score
    model = loadModel("modeloEntrenado.pickle")
 
    data = pd.read_csv(file)
    extra_attacks_list, data = cleanExtraClasses(data, mongo)
    data = cleanData(data, mongo)

    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    preds = model.predict(X)
    score = accuracy_score(y, preds)
    return extra_attacks_list, score


def predict(file, mongo):

    data = pd.read_csv(file)
    dataForPredict = cleanData(data, mongo)
    
    model = loadModel("modeloEntrenado.pickle")

    attackList = modelRegistryDAO.getLastAttackList(mongo)

    for col_name in dataForPredict.columns:
        if col_name == "class":
            X = dataForPredict.iloc[:, :-1]
        else:
            X = dataForPredict.iloc[:, :]
    
    y_prds = model.predict(X)

    from collections import Counter

    predicts = ''

    keys = Counter(y_prds).keys()
    values = Counter(y_prds).values()
    predictData = pd.DataFrame({'key': keys, 'value': values})

    contador = 0
    predicts = {}
    for row in predictData.iterrows():
        index = predictData.loc[contador, 'key']
        #predicts += attackList[index] + " --> " + str(predictData.loc[contador, 'value']) + '\n'
        predicts[attackList[index]] = str(predictData.loc[contador, 'value'])
        #print(mylist[index], " --> ", predictData.loc[contador, 'value'])
        contador += 1
    
    return predicts
