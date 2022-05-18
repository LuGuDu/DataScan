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

export default function R2LInfo() {

    return (
        <div className="section">
            <Container className="align-items-center">
                <Row className="justify-content-between">
                    <Col md="6">
                        <Label className="text-on-back">R2L</Label>
                        <p className="profile-description text-left">
                        Remote to Local (r2l): Ocurre cuando un atacante no tiene una cuenta en la máquina víctima, e intenta obtener 
                        acceso enviando paquetes a una máquina a través de una red para generar alguna vulnerabilidad 
                        en esa máquina que le permita obtener acceso local como usuario de esa máquina. 
                        </p>
                        <div className="btn-wrapper pt-3">
                            <Button className="btn-simple" color="primary" href="">
                                Más información
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