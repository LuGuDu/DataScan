/*!

=========================================================
* BLK Design System React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
    Button,
    Container,
    Row,
    Col,
    Label,
    UncontrolledCarousel,
} from "reactstrap";

const carouselItems = [
    {
        src: require("assets/img/analyze1.jpg").default,
        altText: "Slide 1",
    },
    {
        src: require("assets/img/analyze2.webp").default,
        altText: "Slide 2",
    },
    {
        src: require("assets/img/analyze3.jpg").default,
        altText: "Slide 3",
    },
];

export default function DOSInfo() {

    return (
        <div className="section">
            <Container className="align-items-center">
                <Row className="justify-content-between">
                    <Col md="6">
                        <Label className="text-on-back">DOS</Label>
                        <p className="profile-description text-left mb-0">
                        Denial of Service (DoS): It occurs when an attacker attempts to deny legitimate 
                        users access to a particular service or resource. access to a particular service or resource. 
                        </p>
                        <div className="btn-wrapper pt-3">
                            <Button className="btn-simple" color="primary" href="https://es.wikipedia.org/wiki/Ataque_de_denegaci%C3%B3n_de_servicio" target="_blank">
                                More info
                            </Button>
                        </div>
                    </Col>
                    <Col md="5">
                        <Row className="justify-content-between align-items-center">
                            <UncontrolledCarousel items={carouselItems} />
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}