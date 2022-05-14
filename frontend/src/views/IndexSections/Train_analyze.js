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
} from "reactstrap";

export default function Basics() {
  const navigate = useNavigate();

  const analyze = (e) => {
    e.preventDefault();
    navigate('/analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const train = (e) => {
    e.preventDefault();
    navigate('/train');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="section section-nucleo-icons">
      <img
        alt="..."
        className="path"
        src={require("assets/img/path3.png").default}
      />
      <Container>
        <Row className="justify-content-center">
          <Col lg="8" md="12">
            <h2 className="title">¿Qué quiere hacer?</h2>
            <h4 className="description">
              DataScan le proporciona estas dos funcionalidades principales entre otras
              muchas más que se irán desarrollando con el paso del tiempo o que usted mismo
              descubrirá conforme use la aplicación web.
            </h4>
            <div className="btn-wrapper">
              <Button
                className="btn-round"
                color="primary"
                href="/train"
                rel="noopener noreferrer"
                target="_blank"
                onClick={(e) => train(e)}
              >
                Entrenar
              </Button>
              <Button
                className="btn-round"
                color="primary"
                href="/analyze"
                rel="noopener noreferrer"
                target="_blank"
                onClick={(e) => analyze(e)}
              >
                Analizar
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
