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

export default function Basics() {

    return (
        <div className="section">
            <Container >
                <Row className="justify-content-between">
                    <Col md="5">
                        <Row className="justify-content-between align-items-center">
                            <UncontrolledCarousel items={carouselItems} />
                        </Row>
                    </Col>
                    <Col md="6">
                        <Label className="text-on-back">Probe</Label>
                        <p className="profile-description text-left">
                        Probe: It occurs when an attacker scans a network to gather information or 
                        find known vulnerabilities that will allow him to find known vulnerabilities 
                        that allow him to hack the entire network. 
                        </p>
                        <div className="btn-wrapper pt-3">
                            <Button className="btn-simple" color="primary" href="" >
                                More info
                            </Button>
                        </div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
}