import React from "react";

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'

import ContactHeader from "components/PageHeader/ContactHeader.js"

import IndexNavbar from "components/Navbars/IndexNavbar.js"
import LoginNavBar from "components/Navbars/LoginNavBar"
import Footer from "components/Footer/Footer.js"
import NoLoggedFooter from "components/Footer/NoLoggedFooter.js"

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
    }, []);

    return (
        <>
            <PermissionsGate
                scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
            >
                <IndexNavbar />
            </PermissionsGate>

            <PermissionsGate
                scopes={[SCOPES.noLoggedCanAccess]}
            >
                <LoginNavBar />
            </PermissionsGate>

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

                <PermissionsGate
                    scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
                >
                    <Footer />
                </PermissionsGate>

                <PermissionsGate
                    scopes={[SCOPES.noLoggedCanAccess]}
                >
                    <NoLoggedFooter />
                </PermissionsGate>
            </div>
        </>
    );
};