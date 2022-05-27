import React from "react";

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import ContactHeader from "components/PageHeader/ContactHeader.js"
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
        document.body.classList.toggle("profile-page");
        document.body.classList.toggle("index-page");

        // Specify how to clean up after this effect:
        return function cleanup() {
          document.body.classList.toggle("profile-page");
          document.body.classList.toggle("index-page");

        };
      },[]);

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
                                                <h5 className="text-on-back">CONTACT US</h5>
                                            </CardHeader>
                                            <CardBody>

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