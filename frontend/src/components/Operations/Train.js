import React, { useLayoutEffect } from "react";
import { useNavigate } from 'react-router-dom';

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import TrainHeader from "components/PageHeader/TrainHeader.js"
import Footer from "components/Footer/Footer.js"

import {
    Container,
    Row,
    Col,
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
            if(result['message'] === 200){
                var parElement = document.getElementById("resultData");
                
                var textToAdd = ""       
                for (const [key, value] of Object.entries(result['modelInfo'])) {
                    console.log(key, value);
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
        document.body.classList.toggle("index-page");
        getModelInfo()
        return function cleanup() {
          document.body.classList.toggle("index-page");
        };
      },[]);

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
                if(result['message'] === 200){
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
                if(result['message'] === 200){
                    alert("Accuracy: " + result['accuracy'])
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    const results ={
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
                <TrainHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <Container >     
                            <Row >
                            <Col md="5">
                                <form>
                                    <div class="form-group" >
                                        <h3>Selecciona un archivo</h3>                                        
                                        <div  class="custom-file" >
                                            <input type="file" class="custom-file-input" name="file" id="file" />
                                            <label class="custom-file-label" for="file">
                                                Selecciona un archivo...
                                            </label>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn btn-primary" onClick={(e) => train(e)} >
                                        Entrenar
                                    </button>
                                    <button type="submit" class="btn btn-primary" onClick={(e) => checkModel(e)} >
                                        Comprobar modelo
                                    </button>
                                </form>
                            </Col>
                            </Row>
                        </Container>
                        <section className="section section-lg">
                            <Container>
                                <Row>
                                    <Col>
                                    <div className="results" style={results}>
                                        <h1>Previous Training:</h1>
                                        <pre id="resultData">
                                        </pre> 
                                    </div>
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

