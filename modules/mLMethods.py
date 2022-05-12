import pickle
import pandas as pd
import numpy as np
from sklearn.tree import DecisionTreeClassifier

def saveModel(model):
    # serializar nuestro modelo y salvarlo en el fichero area_model.pickle
    with open("models/modeloEntrenado.pickle", "wb") as file:
        pickle.dump(model, file)
    print ("MODELO GUARDADO")


def loadModel():
    with open('models/modeloEntrenado.pickle', "rb") as file:
        modelLoad = pickle.load(file)
    print("MODELO CARGADO")
    return modelLoad


def cleanData(data):
    from sklearn.preprocessing import LabelEncoder
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


def train(data):
    print("ENTRENANDO")
    from sklearn.model_selection import train_test_split
    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)
    
    
    modelDT = DecisionTreeClassifier(random_state=1)
    modelDT.fit(X_train, y_train)
    improvedModelDT = improveModel(X_train, y_train)

    printAccuracy(modelDT, X_test, y_test)
    printAccuracy(improvedModelDT, X_test, y_test)

    saveModel(improvedModelDT)

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
    print(f"Profundidad del árbol: {improvedModel.get_depth()}")
    print(f"Número de nodos terminales: {improvedModel.get_n_leaves()}")

    return improvedModel

def printAccuracy(model, X_test, y_test):
    from sklearn.metrics import accuracy_score
    preds_knn = model.predict(X_test)
    score_knn = accuracy_score(y_test, preds_knn)
    print("El Accuracy del modelo es: ", score_knn)
    return score_knn

def predict(dataForPredict, mylist):

    model = loadModel()

    for col_name in dataForPredict.columns:
        if col_name == "class":
            X = dataForPredict.iloc[:, :-1]
        else:
            X = dataForPredict.iloc[:, :]
    
    y_prds = model.predict(X)

    from collections import Counter

    predicts = ''

    print("PREDICTED DATA - VALUES:")
    keys = Counter(y_prds).keys()
    values = Counter(y_prds).values()
    predictData = pd.DataFrame({'key': keys, 'value': values})

    contador = 0
    for row in predictData.iterrows():
        index = predictData.loc[contador, 'key']
        predicts += mylist[index] + " --> " + str(predictData.loc[contador, 'value']) + '\n'
        #print(mylist[index], " --> ", predictData.loc[contador, 'value'])
        contador += 1
    
    return predicts