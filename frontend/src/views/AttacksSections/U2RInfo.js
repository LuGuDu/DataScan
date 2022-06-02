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
    Container,
    Row,
    Col,
    Label,
    UncontrolledCarousel,
} from "reactstrap";

const carouselItems = [
    {
        src: require("assets/img/u2r_attack.png").default,
        altText: "Slide 1",
    }
];

export default function U2RInfo() {

    return (
        <div className="section">
            <Container className="align-items-center">
                <Row className="justify-content-between">
                    <Col md="5">
                        <Row className="justify-content-between align-items-center">
                            <UncontrolledCarousel items={carouselItems} />
                        </Row>
                    </Col>
                    <Col md="6">
                        <Label className="text-on-back">U2R</Label>
                        <p className="profile-description text-left">
                        User to Root (u2r): It occurs when a normal system user illegally 
                        accesses root or superuser privileges. root or superuser privileges. 
                        <br/>
                        Examples: buffer_overflow, loadmodule, perl or rootkit.
                        </p>
                    </Col>

                </Row>
            </Container>
        </div>
    );
}