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

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'

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

  const smoothScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col md="3">
            <h1 className="title">DataScan</h1>
          </Col>
          <Col md="2">
            <Nav>
              <PermissionsGate
                scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
              >
                <NavItem>
                  <NavLink to="/welcome" tag={Link} onClick={() => smoothScroll()}>
                    Home
                  </NavLink>
                </NavItem>
              </PermissionsGate>

              <PermissionsGate
                scopes={[SCOPES.noLoggedCanAccess]}
              >
                <NavItem>
                  <NavLink to="/" tag={Link} onClick={() => smoothScroll()}>
                    Home
                  </NavLink>
                </NavItem>
              </PermissionsGate>


            </Nav>
          </Col>
          <Col md="2">
            <Nav>
              <NavItem>
                <NavLink to="/analyze" tag={Link} onClick={() => smoothScroll()}>
                  Analyze
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/contact" tag={Link} onClick={() => smoothScroll()}>
                  Contact us
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/about" tag={Link} onClick={() => smoothScroll()}>
                  About us
                </NavLink>
              </NavItem>
            </Nav>
          </Col>

          <PermissionsGate
            scopes={[SCOPES.noLoggedCanAccess]}
          >
            <Col md="2">
              <Nav>
                <NavItem>
                  <NavLink to="/login" tag={Link} onClick={() => smoothScroll()}>
                    Login
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink to="/register" tag={Link} onClick={() => smoothScroll()}>
                    Register
                  </NavLink>
                </NavItem>
              </Nav>
            </Col>
          </PermissionsGate>

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
