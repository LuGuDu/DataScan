import React from "react";

import ContactHeader from "components/PageHeader/ContactHeader.js"
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

export default function Contact() {

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
                <ContactHeader />
                <div className="main">
                    <div className="section section-basic" id="basic-elements">
                        <section className="section">
                            <Container>
                                <Row>
                                    <Col md="8">
                                        <Card className="card-plain">
                                            <CardHeader>
                                                <h1 className="profile-title text-left">Contact data</h1>
                                                <h5 className="text-on-back">CONTACT</h5>
                                            </CardHeader>
                                            <CardBody>
                                                <Row className="justify-content-between">
                                                    <Col>
                                                        <p className="profile-description text-left mb-0">

                                                            Contact-email: datascan.contacto@gmail.com
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