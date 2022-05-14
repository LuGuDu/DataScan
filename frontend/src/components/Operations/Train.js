import React from "react";
import { useNavigate } from 'react-router-dom';

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import TrainHeader from "components/PageHeader/TrainHeader.js"
import Footer from "components/Footer/Footer.js"

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


async function uploadFile(data) {
    return fetch('/train', {
        method: 'POST',
        body: data
    });
};

async function uploadFileForCheck(data) {
    return fetch('/checkModel', {
        method: 'POST',
        body: data
    });
};

async function getTrainingModelData() {
    return fetch('/getModelData', {
        method: 'GET'
    });
};


export default function Train() {

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

    const navigate = useNavigate();

    const train = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append('file', fileField.files[0]);

        uploadFile(formData)
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    navigate('/');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

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

    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <TrainHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <Container >
                            <Row >
                                <Col md="10">
                                    <Card className="card-plain">
                                        <CardHeader>
                                            <h1 className="profile-title text-left">Selecciona el archivo</h1>
                                            <h5 className="text-on-back">ENTRENAR</h5>
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
                                                <button type="submit" class="btn btn-primary" onClick={(e) => train(e)} >
                                                    Entrenar
                                                </button>
                                                <button type="submit" class="btn btn-primary" onClick={(e) => checkModel(e)} >
                                                    Comprobar modelo
                                                </button>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                        <section className="section section-lg">
                            <Container>
                                <Row>
                                    <Col md="10">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Datos del Entrenamiento Anterior</h1>
                                                <h5 className="text-on-back">MODELO</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <Row>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Archivo usado</label>
                                                                <Input id="in-previous-file" defaultValue="Archivo usado" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Accuracy</label>
                                                                <Input id="in-accuracy" placeholder="Accuracy" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="4">
                                                            <FormGroup>
                                                                <label>Fecha</label>
                                                                <Input id="in-date" placeholder="Fecha" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="2">
                                                            <FormGroup>
                                                                <label>Filas</label>
                                                                <Input id="in-rows" defaultValue="Filas" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Tiempo entrenamiento (s)</label>
                                                                <Input id="in-time" defaultValue="Tiempo entrenamiento (s)" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="2">
                                                            <FormGroup>
                                                                <label>Podado</label>
                                                                <Input id="in-pruning" defaultValue="Podado" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Columnas</label>
                                                                <Input id="in-columns" placeholder="Columnas" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Ataques</label>
                                                                <Input id="in-attacks" placeholder="Ataques" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                        </section>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

