from app import app
import pytest
import json



def test_success_get_model_data():
    response = app.test_client().get("/getModelData")    
    assert response.status_code == 200


def test_success_get_model_format():
    response = app.test_client().get("/getModelFormat")    
    assert response.status_code == 200


def test_success_get_model_history():
    response = app.test_client().get("/getTrainModelHistory")    
    assert response.status_code == 200



def test_failed_check_model():   

    csv = "tests_resources/TrainModificado.csv"
    csv_data = open(csv, "rb")
    data = {"file": (csv_data, "TrainModificado.csv")}

    response = app.test_client().post(
            "/checkModel",
            data=data        
            )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "The file has a bad format"

def test_success_check_model():
    
    csv = "tests_resources/Train.csv"
    csv_data = open(csv, "rb")
    data = {"file": (csv_data, "Train.csv")}

    response = app.test_client().post(
            "/checkModel",
            data=data
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 200


def test_failed_analyze():   

    csv = "tests_resources/TrainModificado.csv"
    csv_data = open(csv, "rb")
    data = {"file": (csv_data, "TrainModificado.csv")}

    response = app.test_client().post(
            "/analyze",
            data=data        
            )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 500
    assert res["message"] == "The file has a bad format"


def test_success_analyze():
    
    csv = "tests_resources/TestDataUnlabeled.csv"
    csv_data = open(csv, "rb")
    data = {"file": (csv_data, "TestDataUnlabeled.csv")}

    response = app.test_client().post(
            "/analyze",
            data=data
        )
    res = json.loads(response.data.decode('utf-8'))
    
    assert response.status_code == 200


def test_failed_train_bad_format():
    
    csv = "tests_resources/TrainModificado.csv"
    csv_data = open(csv, "rb")
    data = {"file": (csv_data, "TrainModificado.csv")}

    response = app.test_client().post(
            "/setFile",
            data=data
        )    
    assert response.status_code == 500



def test_success_train_normail():
    
    csv = "tests_resources/Train.csv"
    csv_data = open(csv, "rb")
    data = {"file": (csv_data, "Train.csv")}

    response = app.test_client().post(
            "/setFile",
            data=data
        )    
    assert response.status_code == 200

    data = {
        "predictors": ["same_srv_rate", "src_bytes", "protocol_type"]
    }

    response = app.test_client().post(
            "/setPredictors",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    assert response.status_code == 200

    data = {
        "prunning": False
    }
    response = app.test_client().post(
            "/finishModelTrain",
            data=json.dumps(data),
            headers={"Content-Type": "application/json"},
        )
    assert response.status_code == 200
