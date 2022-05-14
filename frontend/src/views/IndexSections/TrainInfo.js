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
import { useNavigate } from 'react-router-dom';

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
        src: require("assets/img/train1.jpg").default,
        altText: "Slide 1",
    },
    {
        src: require("assets/img/train3.jpg").default,
        altText: "Slide 2",
    },
    {
        src: require("assets/img/train2.jpeg").default,
        altText: "Slide 3",
    },
];

export default function Basics() {

    React.useEffect(() => {
        document.body.classList.toggle("profile-page");
        // Specify how to clean up after this effect:
        return function cleanup() {
            document.body.classList.toggle("profile-page");
        };
    }, []);

    const navigate = useNavigate();

    const train = (e) => {
        e.preventDefault();
        navigate('/train');
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="section">
            <img
                alt="..."
                className="path"
                src={require("assets/img/path3.png").default}
            />
            <Container>
                <Row className="justify-content-between">
                    <Col md="5">
                        <Row className="justify-content-between align-items-center">
                            <UncontrolledCarousel items={carouselItems} />
                        </Row>
                    </Col>
                    <Col md="6">
                        <Label className="text-on-back">Entrenar</Label>
                        <p className="profile-description text-left">
                            Para analizar sus datos, primero se debe entrenar un modelo de Machine Learning
                            para que éste sea capaz de clasificar con éxito los ataques de ciberseguridad.
                        </p>
                        <div className="btn-wrapper pt-3">
                            <Button className="btn-simple" color="primary" onClick={(e) => train(e)} >
                                Entrenar
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}