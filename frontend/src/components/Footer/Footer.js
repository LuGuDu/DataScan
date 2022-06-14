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
import { Link } from "react-router-dom";
// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function Footer() {

  const smoothScroll = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md="3">
            <h1 className="title">DataScan</h1>
          </Col>
          <Col md="3">
            <Nav>
              <NavItem>
                <NavLink to="/welcome" tag={Link} onClick={(e) => smoothScroll(e)}>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/analyze" tag={Link} onClick={(e) => smoothScroll(e)}>
                  Analyze
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3">
            <Nav>
              <NavItem>
                <NavLink to="/contact" tag={Link} onClick={(e) => smoothScroll(e)}>
                  Contact us
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/about" tag={Link} onClick={(e) => smoothScroll(e)}>
                  About us
                </NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col md="3">
            <h3 className="title">Follow us:</h3>
            <div className="btn-wrapper profile">
              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="https://twitter.com/"
                id="tooltip622135962"
                target="_blank"
              >
                <i className="fab fa-twitter" />
              </Button>

              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="https://www.facebook.com/"
                id="tooltip230450801"
                target="_blank"
              >
                <i className="fab fa-facebook-square" />
              </Button>

              <Button
                className="btn-icon btn-neutral btn-round btn-simple"
                color="default"
                href="https://www.instagram.com/"
                id="tooltip230450801"
                target="_blank"
              >
                <i className="fab fa-instagram" />
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
