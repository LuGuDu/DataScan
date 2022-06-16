import React from "react";

import AboutHeader from "components/PageHeader/AboutHeader.js"

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import Footer from "components/Footer/Footer.js"

import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
} from "reactstrap";

export default function About() {

    React.useEffect(() => {
        document.body.classList.toggle("index-page");
        return function cleanup() {
            document.body.classList.toggle("index-page");
        };
    }, []);


    return (
        <>
            <IndexNavbar />
            <div className="wrapper">
                <AboutHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section">
                            <Container>
                                <Row>
                                    <Col md="8">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Presentation</h1>
                                                <h5 className="text-on-back">About us</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Row className="justify-content-between">
                                                    <Col>
                                                        <p className="profile-description text-left mb-0">
                                                            The DataScan project was born in 2022 as a computer engineering degree final
                                                            project. Its main objective is to provide a tool that helps users to detect
                                                            cyber-attacks in their datasets.
                                                            <br /><br />
                                                            Lucas Gutiérrez is the developer of the project. He studied at the School of
                                                            Computer Science of Ciudad Real, Spain. He specialized in Software Engineering.
                                                            <br /><br />
                                                            In the future, this project may have different orientations:
                                                            <br />
                                                            1. To provide a multipurpose tool to train different machine
                                                            learning models.
                                                            <br />
                                                            2. To convert this IDS system into an IPS system.
                                                        </p>
                                                    </Col>
                                                </Row>
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
}