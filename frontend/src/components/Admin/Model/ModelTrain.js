import React from "react";
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

import AdminNavBar from "components/Navbars/AdminNavbar"

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'
import RestrictedContent from 'components/Role-based-access/RestrictedContent.js'

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Form,
    Alert,
    Table,
    Label,
    Input,
    FormGroup,
} from "reactstrap";

async function uploadFile(data) {
    return fetch('/setFile', {
        method: 'POST',
        body: data
    });
};

async function setPredictors(data) {
    return fetch('/setPredictors', {
        method: 'POST',
        body: data
    });
};

async function getPrunningData() {
    return fetch('/prunning', {
        method: 'GET'
    });
};

async function finishModelTrain(data) {
    return fetch('/finishModelTrain', {
        method: 'POST',
        body: data
    });
};

export default function Train() {

    React.useEffect(() => {
        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");
        $('.AlertContainer').hide()
        $('.AlertPredictorsContainer').hide()
        $('.AlertPrunningContainer').hide()

        document.getElementById("btn-updatePredictors").disabled = true;
        document.getElementById("btn-trainModel").disabled = true;

        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");
            $('.AlertContainer').hide()
            $('.AlertPredictorsContainer').hide()
            $('.AlertPrunningContainer').hide()

        };
    }, []);

    const cleanTableAndAlerts = () => {
        var tableHeaderRowCount = 1;
        var table = document.getElementById('myTable');
        if (table != null) {
            var rowCount = table.rows.length;
            for (var i = tableHeaderRowCount; i < rowCount; i++) {
                table.deleteRow(tableHeaderRowCount);
            }

            $('.AlertPredictorsContainer').hide()
            $('.AlertPrunningContainer').hide()
        }
    }

    const train = (e) => {
        e.preventDefault();

        cleanTableAndAlerts();

        const fileField = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append('file', fileField.files[0]);

        //Check if file type is .csv
        if (fileField.files[0]['type'] !== 'text/csv') {
            $('.AlertContainer').show()
            $('.AccuracyAlert').text("File must be .csv format!")

            //Enable components
            document.getElementById("file").disabled = false;
            document.getElementById("btn-analyzeFile").disabled = false;
            //Disable other buttons
            document.getElementById("btn-updatePredictors").disabled = true;
            document.getElementById("btn-trainModel").disabled = true;

            return
        }

        $('.AlertContainer').show()
        $('.AccuracyAlert').text("Analyzing file, wait please...")

        //Disable other buttons
        document.getElementById("file").disabled = true;
        document.getElementById("btn-analyzeFile").disabled = true;
        document.getElementById("btn-updatePredictors").disabled = true;
        document.getElementById("btn-trainModel").disabled = true;

        uploadFile(formData)
            .then(response => response.json())
            .then(result => {
                if (result['message'] === 200) {

                    $('.AlertContainer').show()
                    $('.AccuracyAlert').text("Ready! - Now choose the predictors")

                    //Enable buttons
                    document.getElementById("file").disabled = false;
                    document.getElementById("btn-analyzeFile").disabled = false;
                    document.getElementById("btn-updatePredictors").disabled = false;

                    var myObj = JSON.parse(result['predictors']);
                    var counter = 1;

                    var lista = document.getElementById("myTable");

                    for (const key in myObj) {

                        var tr = document.createElement("tr");
                        lista.appendChild(tr);

                        var columna = document.createElement("td")
                        columna.innerHTML = counter.toString();
                        tr.appendChild(columna);

                        for (const item in myObj[key]) {

                            columna = document.createElement("td")
                            columna.innerHTML = myObj[key][item];
                            tr.appendChild(columna);
                        }

                        columna = document.createElement("td")

                        var checkbox = document.createElement("Input");
                        checkbox.type = "checkbox";
                        checkbox.name = "select";
                        checkbox.className += "form-check-input";

                        columna.appendChild(checkbox)

                        tr.appendChild(columna);

                        counter += 1
                    }
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

    const checkPredictors = (e) => {
        e.preventDefault();

        var predictors = [];

        document.getElementById("btn-trainModel").disabled = true;

        var resume_table = document.getElementById("myTable");

        var predictorsCount = 0;

        $('table [type="checkbox"]').each(function (i, chk) {
            if (chk.checked) {
                predictors.push(resume_table.rows[i + 1].cells[1].innerText)
                predictorsCount += 1
            }
        });

        if (predictorsCount < 2) {
            $('.AlertPredictorsContainer').show()
            $('.AccuracyPredictorsAlert').text("You must choose at least 2 predictors")
            return
        }

        var jsonData = {}
        jsonData["predictors"] = predictors

        setPredictors(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    $('.AlertPredictorsContainer').show()
                    $('.AccuracyPredictorsAlert').text("Accuracy: " + result["accuracy"])
                    prunning()
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const prunning = () => {
        $('.AlertPrunningContainer').show()
        $('.AccuracyPrunningAlert').text("Calculating the accuracy, wait please...")
        document.getElementById("btn-trainModel").disabled = true;

        getPrunningData()
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    $('.AccuracyPrunningAlert').text("Accuracy (with pruning): " + result["accuracy"])
                    document.getElementById("btn-trainModel").disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const navigate = useNavigate();

    const finishTrain = (e) => {
        e.preventDefault()

        document.getElementById("file").disabled = true;
        document.getElementById("btn-analyzeFile").disabled = true;
        document.getElementById("btn-updatePredictors").disabled = true;
        document.getElementById("btn-trainModel").disabled = true;

        var jsonData = {}

        var remember = document.getElementById('prunning');
        if (remember.checked) {
            jsonData["prunning"] = true
        } else {
            jsonData["prunning"] = false
        }

        finishModelTrain(JSON.stringify(jsonData))
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                alert("Success training!")
                navigate('/admin/model/info');
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    return (
        <>
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess]}
                RenderForbiddenContent={() => <RestrictedContent allowedRole={"administrator"} />}
            >
                <AdminNavBar />
                <div className="wrapper">
                    <div className="main">
                        <div className="section section-basic" id="basic-elements">
                            <Container >
                                <Row >
                                    <Col md="10">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h5 className="text-on-back">Select</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Form>
                                                    <div className="form-group" >
                                                        <div className="custom-file" >
                                                            <input onChange={(e) => changeName(e)} type="file" className="custom-file-input" name="file" id="file" accept=".csv"/>
                                                            <label id="labelFile" className="custom-file-label" htmlFor="file">
                                                                Select file
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <button type="submit" id="btn-analyzeFile" className="btn btn-info btn-round" onClick={(e) => train(e)} >
                                                        Analyze file
                                                    </button>
                                                </Form>
                                                <div className="AlertContainer">
                                                    <Alert className="AccuracyAlert" color="info">
                                                        <strong>Train completed!</strong>
                                                    </Alert >
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <section className="section section-lg">
                                        <Container>
                                            <Row>
                                                <Col md="12">
                                                    <Card className="card-plain">
                                                        <CardHeader>
                                                            <h5 className="text-on-back">Predictors</h5>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Col className="" lg="12" md="6" >
                                                                <Table className="table responsive" id="myTable">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="text-left">#</th>
                                                                            <th className="text-left">Predictor</th>
                                                                            <th className="text-left">Importance</th>
                                                                            <th className="text-left">Select</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody> </tbody>
                                                                </Table>
                                                            </Col>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <button type="submit" id="btn-updatePredictors" className="btn btn-info btn-round" onClick={(e) => checkPredictors(e)} >
                                                    Update predictors
                                                </button>
                                            </Row>
                                            <Row>
                                                <div className="AlertPredictorsContainer">
                                                    <Alert className="AccuracyPredictorsAlert" color="info">
                                                    </Alert >
                                                </div>
                                            </Row>
                                        </Container>
                                    </section>
                                </Row>
                                <Row>
                                    <section className="section section-lg">
                                        <Container>
                                            <Row>
                                                <Col md="12">
                                                    <Card className="card-plain">
                                                        <CardHeader>
                                                            <h5 className="text-on-back">Pruning</h5>
                                                        </CardHeader>
                                                        <CardBody>
                                                            <Col className="" lg="12" md="6" >
                                                                <div className="AlertPrunningContainer">
                                                                    <Alert className="AccuracyPrunningAlert" color="info">
                                                                    </Alert >
                                                                </div>
                                                            </Col>
                                                            <Row>
                                                                <FormGroup check className="text-left">
                                                                    <Label check>
                                                                        <Input id="prunning" type="checkbox" />
                                                                        <span className="form-check-sign" />I want to pruning the model tree
                                                                    </Label>
                                                                </FormGroup>
                                                            </Row>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <button type="submit" className="btn btn-info btn-round" id="btn-trainModel" onClick={(e) => finishTrain(e)} >
                                                    Train the model
                                                </button>
                                            </Row>
                                        </Container>
                                    </section>
                                </Row>
                            </Container>
                        </div>
                    </div>
                </div>
            </PermissionsGate>
        </>
    );
};

