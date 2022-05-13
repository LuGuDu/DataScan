import React from "react";
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


export default function Train() {

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        // Specify how to clean up after this effect:
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
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

