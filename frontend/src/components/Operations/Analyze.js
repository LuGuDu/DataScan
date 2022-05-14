import React from "react";
import { useNavigate } from 'react-router-dom';

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import AnalyzeHeader from "components/PageHeader/AnalyzeHeader.js"
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
    return fetch('/analyze', {
        method: 'POST',
        body: data
    });
};

export default function Analyze() {

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        document.body.classList.toggle("profile-page");

        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");
        };
    }, []);

    const update = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        const formData = new FormData();
        formData.append('file', fileField.files[0]);

        document.getElementById("btn-analyze").disabled = true;
        document.getElementById("file").disabled = true;
        document.getElementById("resultData").innerHTML = "";
        //document.getElementById("btn-analyze").style.cursor = "wait"

        uploadFile(formData)
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {
                    //console.log(result['predicts'])
                    document.getElementById("btn-analyze").disabled = false;
                    document.getElementById("file").disabled = false;
                    //document.getElementById("btn-analyze").style.cursor = "auto"

                    var parElement = document.getElementById("resultData");
                    var textToAdd = document.createTextNode(result['predicts']);
                    parElement.appendChild(textToAdd);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById("btn-analyze").disabled = false;
                document.getElementById("file").disabled = false;
                //document.getElementById("btn-analyze").style.cursor = "auto"
            });
    }

    const changeName = (e) => {
        e.preventDefault();

        const fileField = document.querySelector('input[type="file"]');
        var x = document.getElementById("labelFile");
        if (fileField.files[0])
            x.innerHTML = fileField.files[0]['name']
    }

    const results = {
        marginLeft: "15px",
        padding: "15px",
        textAlign: "left",
        borderRadius: "15px",
        borderStyle: "solid",
        borderColor: "#ffffff"
    }

    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <AnalyzeHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <Container >
                            <Row >
                                <Col md="10">
                                    <Card className="card-plain">
                                        <CardHeader>
                                            <h1 className="profile-title text-left">Selecciona el archivo</h1>
                                            <h5 className="text-on-back">ANALIZAR</h5>
                                        </CardHeader>
                                        <CardBody>
                                            <Form>
                                                <div className="form-group">
                                                    <div id="fileSelector" className="custom-file">
                                                        <input onChange={(e) => changeName(e)} type="file" className="custom-file-input" name="file" id="file" />
                                                        <label id="labelFile" className="custom-file-label" htmlFor="file">
                                                            Selecciona un archivo...
                                                        </label>
                                                    </div>
                                                </div>
                                                <button type="submit" id="btn-analyze" className="btn btn-primary" onClick={(e) => update(e)}>
                                                    Analizar
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
                                    <Col>
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Datos del Analisis</h1>
                                                <h5 className="text-on-back">RESULTADO</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <div className="results" style={results}>
                                                    <pre id="resultData">
                                                    </pre>
                                                </div>
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