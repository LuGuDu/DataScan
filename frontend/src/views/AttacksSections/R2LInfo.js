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
        src: require("assets/img/r2l_attack.webp").default,
        altText: "Slide 1",
    }
];

export default function R2LInfo() {

    return (
        <div className="section">
            <Container className="align-items-center">
                <Row className="justify-content-between">
                    <Col md="6">
                        <Label className="text-on-back">R2L</Label>
                        <p className="profile-description text-left">
                        Remote to Local (r2l): It occurs when an attacker wants to gain unauthorized access to 
                        a victim hacine in the entire network.
                        <br/>
                        Examples: ftp_write, guess_passwd, imap, multihop, phf, spy, warezclient or warezmaster.
                        </p>
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