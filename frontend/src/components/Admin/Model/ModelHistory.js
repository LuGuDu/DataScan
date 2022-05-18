import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,

    Table,
} from "reactstrap";

async function getTrainModelHistory() {
    return fetch('/getTrainModelHistory', {
        method: 'GET'
    });
};

export default function ModelHistory() {

    const getModelHistory = (e) => {

        getTrainModelHistory()
            .then(response => response.json())
            .then(result => {
                console.log('Success:', result);
                if (result['message'] === 200) {

                    var counter = 1;
                    result['modelHistory'].forEach((element) => {

                        var lista = document.getElementById("myTable");
                        var tr = document.createElement("tr");
                        lista.appendChild(tr);

                        var columna = document.createElement("td")
                        columna.innerHTML = counter.toString();
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['trainingFileName'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['date'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['timeTraining'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['improved'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['accuracy'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['rows'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['columns'];
                        tr.appendChild(columna);

                        columna = document.createElement("td")
                        columna.innerHTML = element['attack_list'];
                        tr.appendChild(columna);

                        counter += 1
                    }
                    )
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    React.useEffect(() => {

        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");
        getModelHistory()
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
            document.body.classList.toggle("index-page");
        };
    }, []);

    return (
        <>
            <AdminNavbar />
            <div className="wrapper">

                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section section-lg">
                            <Container>
                                <Row>
                                    <Col md="12">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Historial de entrenamientos</h1>
                                                <h5 className="text-on-back">MODELO</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Col className="ml-auto mr-auto" lg="12" md="5" >

                                                    <Table responsive id="myTable">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-left">#</th>
                                                                <th classname="text-left">Archivo usado</th>
                                                                <th className="text-left">Fecha</th>
                                                                <th className="text-left">Tiempo </th>
                                                                <th className="text-left">Podado</th>
                                                                <th className="text-left">Accuracy</th>
                                                                <th className="text-left">Filas</th>
                                                                <th className="text-left">Columnas</th>
                                                                <th className="text-left">Ataques</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                        </tbody>
                                                    </Table>
                                                </Col>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>

                                </Row>
                            </Container>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
};