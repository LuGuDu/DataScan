import React from "react";

import AdminNavbar from "components/Navbars/AdminNavbar"

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'
import RestrictedContent from 'components/Role-based-access/RestrictedContent.js'

import {
    Container,
    Row,
    Col,
    Card,
    CardTitle,
    CardHeader,
    CardBody,
    CardFooter,
    Table,
    Button,
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

        var lista = document.getElementById("myTable");
        if(lista != null) {
            getModelHistory()
        }

        return function cleanup() {
        };
    }, []);

    const goUp = (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <>
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess]}
                RenderForbiddenContent={() => <RestrictedContent allowedRole={"administrator"} />}
            >
                <AdminNavbar />
                <div className="wrapper">

                    <div className="main">
                        <div className="section section-basic" id="basic-elements">
                            <section className="section section-lg">
                                <Container>
                                    <h5 className="text-on-back">Model</h5>

                                    <Card >
                                        <CardHeader>
                                            <CardTitle tag="h3">History list</CardTitle>
                                        </CardHeader>
                                        <CardBody>
                                            <Row>
                                                <Col>
                                                    <Table responsive id="myTable" data-show-toggle="false" data-expand-first="true">
                                                        <thead>
                                                            <tr>
                                                                <th className="text-left">#</th>
                                                                <th className="text-left">Archivo usado</th>
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
                                            </Row>
                                        </CardBody>
                                        <CardFooter>
                                            <Button className="btn-round" color="info" size="lg" onClick={(e) => goUp(e)}>
                                                Go up
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Container>
                            </section>
                        </div>
                    </div>
                </div>
            </PermissionsGate>
        </>
    );
};