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
import classnames from "classnames";
// plugin that creates slider
import Slider from "nouislider";

// reactstrap components
import {
  Button,
  Label,
  FormGroup,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function Basics() {

  return (
    <div className="section section-basic" id="basic-elements">
      <img
        alt="..."
        className="path"
        src={require("assets/img/path1.png").default}
      />
      <Container>
        <h3>Selecciona una acción</h3>
        <Row style={{display: 'flex', justifyContent: 'center'}}>
          <Col md="10">
            <Button className="btn-round" color="primary" syze="lg" type="button">
              Analizar
            </Button>
            <Button className="btn-round" color="primary" syze="lg" type="button">
              Entrenar
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
