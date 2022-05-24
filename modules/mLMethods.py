import pickle, time
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from datetime import datetime


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
        
    data['class'] = data.pop('class')

    return data

def cleanData(data):
    le = LabelEncoder()

    #Pasar los datos no numericos a valores numericos
    for col_name in data.columns:
        if data[col_name].dtype == object:
            data[col_name] = le.fit_transform(data[col_name])

    #Seleccionar unicamente las columnas mas relevantes para el modelo
    newData = pd.DataFrame()

    newData['same_srv_rate'] = data['same_srv_rate']
    newData['src_bytes'] = data['src_bytes']
    newData['protocol_type'] = data['protocol_type']
    newData['dst_host_diff_srv_rate'] = data['dst_host_diff_srv_rate']
    newData['count'] = data['count']
    newData['service'] = data['service']
    
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
    #guardar lista de ataques?
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


def train(data, fileData, mongo):
    print("ENTRENANDO")
    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)
      
    modelDT = DecisionTreeClassifier(random_state=1)
    
    inicio = time.time()
    modelDT.fit(X_train, y_train)
    improvedModelDT = improveModel(X_train, y_train)
    fin = time.time()
    tiempoEntrenamiento = fin-inicio
 
    scoreOr = checkAccuracy(modelDT, X_test, y_test)
    scoreIm = checkAccuracy(improvedModelDT, X_test, y_test)

    finalScore = scoreIm
    finalModel = improvedModelDT
    improved = True

    if scoreIm < scoreOr:
        improved = False
        finalScore = scoreOr
        finalModel = modelDT

    saveModel(finalModel)

    mongo.modelTrainHistorial.insert_one({'trainingFileName': fileData['fileName'], 'date': datetime.now(), 
        'timeTraining': tiempoEntrenamiento, 'modelFileName': 'modeloentrenado.pickle', 'improved': improved, 'accuracy': finalScore, 
        'rows': data.shape[0], 'columns': data.columns.values.tolist(), 'attack_list': fileData['attackList']})


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


def getModelInfo(mongo):
    modelInfo = mongo.modelTrainHistorial.find_one(sort=[("date", -1)])
    modelInfo.pop('_id', None)
    return modelInfo

def getTrainModelHistory(mongo):
    modelHistory = list(mongo.modelTrainHistorial.find(sort=[("date", -1)]))
    
    for element in modelHistory:
        element.pop('_id', None)
        element.pop('modelFileName', None)
        element.update({'accuracy': str(round(element['accuracy'],4))})
        element.update({'timeTraining': str(round(element['timeTraining'],2))})
        element.update({'date': str(element['date'])})
    
    return modelHistory


def checkModel(data, modelName):
    from sklearn.metrics import accuracy_score
    model = loadModel(modelName)

    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    preds = model.predict(X)
    score = accuracy_score(y, preds)
    return score


def predict(dataForPredict, mongo):
    
    model = loadModel("modeloEntrenado.pickle")
    attackList = mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["attack_list"]

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
