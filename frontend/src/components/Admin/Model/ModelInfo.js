import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormGroup,
    Form,
    Input,
} from "reactstrap";

async function getTrainingModelData() {
    return fetch('/getModelData', {
        method: 'GET'
    });
};

async function uploadFileForCheck(data) {
    return fetch('/checkModel', {
        method: 'POST',
        body: data
    });
};


export default function ModelInfo() {

    const checkModel = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append('file', fileField.files[0]);

        uploadFileForCheck(formData)
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    alert("Accuracy: " + result['accuracy'])
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const changeName = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        var x = document.getElementById("labelFile");
        if(fileField.files[0])
            x.innerHTML = fileField.files[0]['name']
    }

    const getModelInfo = (e) => {

        getTrainingModelData()
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    var parElement = document.getElementById("resultData");

                    var textToAdd = ""
                    for (const [key, value] of Object.entries(result['modelInfo'])) {

                        document.getElementById("in-previous-file").value = result['modelInfo']['trainingFileName'];
                        document.getElementById("in-accuracy").value = result['modelInfo']['accuracy'];
                        document.getElementById("in-date").value = result['modelInfo']['date'];
                        document.getElementById("in-time").value = result['modelInfo']['timeTraining'];
                        document.getElementById("in-rows").value = result['modelInfo']['rows'];
                        document.getElementById("in-pruning").value = result['modelInfo']['improved'];
                        document.getElementById("in-columns").value = result['modelInfo']['columns'];
                        document.getElementById("in-attacks").value = result['modelInfo']['attack_list'];

                        textToAdd += key + " -> " + value + "\n"
                    }

                    var text = document.createTextNode(textToAdd);
                    parElement.appendChild(text);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    React.useEffect(() => {

        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");
        getModelInfo()
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");
        };
    }, []);

    const modelData = {
        color: "gray",
    }

    return (
        <>
            <AdminNavbar />
            <div className="wrapper">

                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section section-lg">
                            <Container>
                                <Row>
                                    <Col md="16">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Datos del Entrenamiento</h1>
                                                <h5 className="text-on-back">MODELO</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Archivo usado</label>
                                                                <Input id="in-previous-file" style={modelData} defaultValue="Archivo usado" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Accuracy</label>
                                                                <Input id="in-accuracy" style={modelData} placeholder="Accuracy" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="4">
                                                            <FormGroup>
                                                                <label>Fecha</label>
                                                                <Input id="in-date" style={modelData} placeholder="Fecha" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="2">
                                                            <FormGroup>
                                                                <label>Filas</label>
                                                                <Input id="in-rows" style={modelData} defaultValue="Filas" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Tiempo entrenamiento (s)</label>
                                                                <Input id="in-time" style={modelData} defaultValue="Tiempo entrenamiento (s)" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="2">
                                                            <FormGroup>
                                                                <label>Podado</label>
                                                                <Input id="in-pruning" style={modelData} defaultValue="Podado" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Columnas</label>
                                                                <Input id="in-columns" style={modelData} placeholder="Columnas" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Ataques</label>
                                                                <Input id="in-attacks" style={modelData} placeholder="Ataques" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="10">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Check the model</h1>
                                                <h5 className="text-on-back">Check</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <div class="form-group" >
                                                        <div class="custom-file" >
                                                            <input onChange={(e) => changeName(e)} type="file" class="custom-file-input" name="file" id="file" />
                                                            <label id="labelFile" class="custom-file-label" for="file">
                                                                Seleccionar un archivo
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <button type="submit" class="btn btn-primary" onClick={(e) => checkModel(e)} >
                                                        Comprobar modelo
                                                    </button>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};