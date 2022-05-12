import pickle

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

    print('DATOS LIMPIADOS')
    return data


def train(data):
    print("ENTRENANDO")
    from sklearn.model_selection import train_test_split
    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=1)
    
    from sklearn.tree import DecisionTreeClassifier
    modelDT = DecisionTreeClassifier(random_state=1)
    modelDT.fit(X_train, y_train)
    printAccuracy(modelDT, X_test, y_test)
    saveModel(modelDT)


def printAccuracy(model, X_test, y_test):
    from sklearn.metrics import accuracy_score
    preds_knn = model.predict(X_test)
    score_knn = accuracy_score(y_test, preds_knn)
    print("El Accuracy del modelo es: ", score_knn)
    return score_knn