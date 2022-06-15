"""Controller class for the Machine Learning methods"""

import pickle
import time
from datetime import datetime
import json
import os
from collections import Counter

from flask import abort as fabort, make_response

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

import numpy as np
import pandas as pd
from dao.ModelRegistryDAO import ModelRegistryDAO
from model.ModelRegistry import ModelRegistry


model_registry_dao = ModelRegistryDAO()


def abort(status_code, message):
    """Method to abort the request in case of error"""
    data = {"message": message, "status_code": status_code}
    response = make_response(json.dumps(data))
    response.status_code = status_code
    response.content_type = 'application/json'
    fabort(response)


def save_model(model, file_name):
    """Method to save the model in a pickle file"""
    with open("models/" + file_name, "wb") as file:
        pickle.dump(model, file)
    print ("Model has been saved")


def load_model(file_name):
    """Method to load the model saved in a pickle file"""
    try:
        with open('models/' + file_name, "rb") as file:
            model_load = pickle.load(file)
        print("Model has been load")
    except FileNotFoundError:
        abort(500, 'No model trained found, train the model again.')
    return model_load


def normalize_data(data):
    """Method to normalize the data. Converts no numeric values into numerics"""
    label_encoder = LabelEncoder()

    for col_name in data.columns:
        if data[col_name].dtype == object:
            data[col_name] = label_encoder.fit_transform(data[col_name])

    if 'class' in data.columns:
        data['class'] = data.pop('class')

    return data

def clean_data(data, mongo):
    """Method to clean the data. Only selects the columns of the train model"""
    columns = mongo.modelTrainHistorial.find_one(sort=[("date", -1)])["columns"]

    data = normalize_data(data)

    #Seleccionar unicamente las columnas mas relevantes para el modelo
    new_data = pd.DataFrame()

    for col_name in columns:
        if col_name == 'class':
            continue
        else:
            new_data[col_name] = data[col_name]

    if 'class' in data.columns:
        new_data['class'] = data['class']

    print('Data has been cleaned')
    return new_data


def clean_data_predictors(data, predictors_list):
    """Method to clean the predictors """
    new_data = pd.DataFrame()
    for column in predictors_list:
        if column != 'class':
            new_data[column] = data[column]

    if 'class' in data.columns:
        new_data['class'] = data['class']

    return new_data


def check_accuracy(model, x_test, y_test):
    """Mhetod to check the accuracy of the model"""
    preds = model.predict(x_test)
    score = accuracy_score(y_test, preds)
    print("The accuracy's model is: ", score)
    return score


def train_aux_model(file):
    """Method to train an auxiliar model"""
    data = read_csv_file(file)
    data.to_csv('models/dataTrain.csv', encoding='utf-8', index=False)
    f = open("models/fileName.txt", "w")
    f.write(file.filename)

    data = normalize_data(data)

    x_data = data.iloc[:, :-1]
    y_data = data.iloc[:, -1]

    x_train, x_test, y_train, y_test = train_test_split(
x_data, y_data, test_size=0.3, random_state=1)

    model_dt = DecisionTreeClassifier(random_state=1)
    model_dt.fit(x_train, y_train)
    accuracy = check_accuracy(model_dt, x_test, y_test)

    importancia_predictores = pd.DataFrame({'predictor': x_data.columns,
        'importancia': model_dt.feature_importances_}).sort_values('importancia', ascending=False)

    return accuracy, importancia_predictores.to_json(orient = 'records')


def check_predictors(predictors):
    """Method to check the accuracy of the selected predictors"""

    data = read_csv_file('models/dataTrain.csv')
    data = normalize_data(data)
    data = clean_data_predictors(data, predictors)
    data.to_csv('models/dataTrainNewPredictors.csv', encoding='utf-8', index=False)

    x_data = data.iloc[:, :-1]
    y_data = data.iloc[:, -1]

    x_train, x_test, y_train, y_test = train_test_split(
x_data, y_data, test_size=0.3, random_state=1)

    model_dt = DecisionTreeClassifier(random_state=1)
    model_dt.fit(x_train, y_train)
    accuracy = check_accuracy(model_dt, x_test, y_test)

    return accuracy


def get_prunning_accuracy():
    """Method to check the accuracy of the pruning model"""

    data = read_csv_file('models/dataTrainNewPredictors.csv')

    x_data = data.iloc[:, :-1]
    y_data = data.iloc[:, -1]

    x_train, x_test, y_train, y_test = train_test_split(
x_data, y_data, test_size=0.3, random_state=1)

    improved_model_dt = improve_model(x_train, y_train)

    accuracy = check_accuracy(improved_model_dt, x_test, y_test)

    return accuracy


def final_train_model(pruning, mongo):
    """Method to train the final model"""

    data = read_csv_file('models/dataTrainNewPredictors.csv')

    x_data = data.iloc[:, :-1]
    y_data = data.iloc[:, -1]

    x_train, x_test, y_train, y_test = train_test_split(
x_data, y_data, test_size=0.3, random_state=1)

    begin_time = 0
    final_time = 0

    model_dt = ""

    if pruning:
        begin_time = time.time()
        model_dt = improve_model(x_train, y_train)
    else:
        begin_time = time.time()
        model_dt = normal_model(x_train, y_train)

    final_time = time.time()
    time_training = final_time-begin_time

    accuracy = check_accuracy(model_dt, x_test, y_test)

    save_model(model_dt, "modeloEntrenado.pickle")

    f = open("models/fileName.txt", "r")
    file_name = f.read()
    f.close()
    data_original = read_csv_file('models/dataTrain.csv')

    #Debe hacerse antes de la normalizacion para obtener los nombres
    attack_list = list(dict.fromkeys(sorted(data_original['class'])))
    #fileData = {'fileName':fileName, 'attackList': attackList}

    rows = data.shape[0]
    columns = data.columns.values.tolist()

    model_registry = ModelRegistry(file_name, datetime.now(),
time_training, pruning, accuracy, rows, columns, attack_list)

    model_registry_dao.save(model_registry.get_json(), mongo)

    #delete aux files
    
    os.remove("models/dataTrain.csv")
    os.remove("models/dataTrainNewPredictors.csv")
    os.remove("models/fileName.txt")


def normal_model(x_train, y_train):
    """Method to create and train a normal decision tree model"""
    model_dt = DecisionTreeClassifier(random_state=1)
    model_dt.fit(x_train, y_train)
    return model_dt


def improve_model(x_train, y_train):
    """Method to create and train a improved decision tree model"""
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
    grid.fit(x_train, y_train)

    improved_model = grid.best_estimator_

    return improved_model


def get_model_format(mongo):
    """Method that returns the columns list of the actual model"""
    model_format = list(model_registry_dao.get_last_columns_list(mongo))
    return model_format


def get_model_info(mongo):
    """Method that returns the actual model info"""
    model_info = model_registry_dao.get_last_registry(mongo)
    model_info.pop('_id', None)
    return model_info


def get_train_model_history(mongo):
    """Method that returns the list of the history of trains"""
    model_history = list(model_registry_dao.get_all_registry(mongo))

    for element in model_history:
        element.pop('_id', None)
        element.pop('modelFileName', None)
        element.update({'accuracy': str(round(element['accuracy'],4))})
        element.update({'timeTraining': str(round(element['timeTraining'],2))})
        element.update({'date': str(element['date'])})

    return model_history


def clean_extra_classes(data, mongo):
    """Method to cleans the data from extra classes"""
    attacks = list(model_registry_dao.get_last_attack_list(mongo))

    extra_attacks = []

    for row in data.iterrows():
        if row[1]['class'] not in attacks:
            extra_attacks.append(row[1]['class'])
            data = data.drop(row[0])

    extra_attacks_list = list(dict.fromkeys(extra_attacks))

    return extra_attacks_list, data

def read_csv_file(file):
    """Method to read csv files"""
    try:
        data = pd.read_csv(file)
    except Exception:
        abort(500, 'The file has a bad format')
    return data


def check_model(file, mongo):
    """Method to check the actual model with another csv"""
    model = load_model("modeloEntrenado.pickle")

    data = read_csv_file(file)

    try:
        extra_attacks_list, data = clean_extra_classes(data, mongo)
        data = clean_data(data, mongo)
    except KeyError:
        abort(500, 'The file has no class column')
    except ValueError:
        abort(500, 'The file has internal problems')
    except AttributeError:
        abort(500, 'The file dont have the right columns')

    x_data = data.iloc[:, :-1]
    y_data = data.iloc[:, -1]

    preds = model.predict(x_data)
    score = accuracy_score(y_data, preds)
    return extra_attacks_list, score


def predict(file, mongo):
    """Method to analyze a csv file using the actual trained model"""
    data = read_csv_file(file)
    try:
        data_for_predict = clean_data(data, mongo)
    except ValueError:
        abort(500, 'The file has internal problems')
    except AttributeError:
        abort(500, 'The file dont have the right columns')

    model = load_model("modeloEntrenado.pickle")

    attack_list = model_registry_dao.get_last_attack_list(mongo)

    for col_name in data_for_predict.columns:
        if col_name == "class":
            x_data = data_for_predict.iloc[:, :-1]
        else:
            x_data = data_for_predict.iloc[:, :]

    predicts = ''

    keys = Counter(model.predict(x_data)).keys()
    values = Counter(model.predict(x_data)).values()
    predict_data = pd.DataFrame({'key': keys, 'value': values})

    contador = 0
    predicts = {}
    for row in predict_data.iterrows():
        index = predict_data.loc[contador, 'key']
        predicts[attack_list[index]] = str(predict_data.loc[contador, 'value'])
        contador += 1

    return predicts
