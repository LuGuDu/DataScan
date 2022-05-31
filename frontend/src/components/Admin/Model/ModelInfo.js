import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardImg,
    CardTitle,
    FormGroup,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Button,
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
        if (fileField.files[0])
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
                                <h5 className="text-on-back">Model</h5>

                                <Row>
                                    <Col className="offset-lg-0 offset-md-3" lg="20" md="20">
                                        <div
                                            className="square square-7"
                                            id="square7"
                                        />
                                        <div
                                            className="square square-8"
                                            id="square8"
                                        />
                                        <Card className="card-register">
                                            <CardHeader>
                                                <CardImg
                                                    alt="..."
                                                    src={require("assets/img/square1.png").default}
                                                />
                                                <CardTitle tag="h4">data</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <Form className="form" autocomplete="off">
                                                <Row>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>File used</label>
                                                                <Input id="in-previous-file" style={modelData} defaultValue="File used" type="text" readonly="readonly" />
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
                                                                <label>Date</label>
                                                                <Input id="in-date" style={modelData} placeholder="Date" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="2">
                                                            <FormGroup>
                                                                <label>Rows</label>
                                                                <Input id="in-rows" style={modelData} defaultValue="Rows" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="3">
                                                            <FormGroup>
                                                                <label>Training time (s)</label>
                                                                <Input id="in-time" style={modelData} defaultValue="Training time (s)" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md="2">
                                                            <FormGroup>
                                                                <label>Pruning</label>
                                                                <Input id="in-pruning" style={modelData} defaultValue="Pruning" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Columns</label>
                                                                <Input id="in-columns" style={modelData} placeholder="Columns" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md="12">
                                                            <FormGroup>
                                                                <label>Attacks</label>
                                                                <Input id="in-attacks" style={modelData} placeholder="Attacks" type="text" readonly="readonly" />
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                            <CardFooter>
                                            <Form>
                                                <h4>Check the model</h4>
                                                    <div class="form-group" >
                                                        <div class="custom-file" >
                                                            <input onChange={(e) => changeName(e)} type="file" class="custom-file-input" name="file" id="file" />
                                                            <label id="labelFile" class="custom-file-label" for="file">
                                                                Select a file
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <Button className="btn-round" color="info" onClick={(e) => checkModel(e)} >
                                                        Check model
                                                    </Button>
                                                </Form>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>

                            </Container>
                            <Container>

                            </Container>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};