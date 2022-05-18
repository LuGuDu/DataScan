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
import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  NavLink,
  Container,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";

export default function AdminNavbar() {

  const navigate = useNavigate();

  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");

  React.useEffect(() => {

    return function cleanup() {

    };
  }, []);

  const toggleCollapse = () => {
    document.documentElement.classList.toggle("nav-open");
    setCollapseOpen(!collapseOpen);
  };

  const onCollapseExiting = () => {
    setCollapseOut("collapsing-out");
  };

  const onCollapseExited = () => {
    setCollapseOut("");
  };

  const smoothScroll = (e) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Navbar className={"fixed-top bg-info"} color-on-scroll="100" expand="lg">
      <Container>
        <div className="navbar-translate">
          <NavbarBrand to="/admin" tag={Link} id="navbar-brand" onClick={(e) => smoothScroll(e)}>
            <span>DataScan - Panel administrador</span>
          </NavbarBrand>
          <button
            aria-expanded={collapseOpen}
            className="navbar-toggler navbar-toggler"
            onClick={toggleCollapse}
          >
            <span className="navbar-toggler-bar bar1" />
            <span className="navbar-toggler-bar bar2" />
            <span className="navbar-toggler-bar bar3" />
          </button>
        </div>
        <Collapse
          className={"justify-content-end " + collapseOut}
          navbar
          isOpen={collapseOpen}
          onExiting={onCollapseExiting}
          onExited={onCollapseExited}
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <a href="/" onClick={(e) => smoothScroll(e)}>
                  DataScan
                </a>
              </Col>
              <Col className="collapse-close text-right" xs="6">
                <button
                  aria-expanded={collapseOpen}
                  className="navbar-toggler"
                  onClick={toggleCollapse}
                >
                  <i className="tim-icons icon-simple-remove" />
                </button>
              </Col>
            </Row>
          </div>
          <Nav navbar>
          <UncontrolledDropdown nav>
              <DropdownToggle
                caret
                color="primary"
                data-toggle="dropdown"
                href="/admin/model"
                nav
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa fa-cogs d-lg-none d-xl-none" />
                Modelo
              </DropdownToggle>
              <DropdownMenu className="dropdown-with-icons">
                <DropdownItem tag={Link} to="/admin/model/train" onClick={(e) => smoothScroll()}>
                  Entrenamiento
                </DropdownItem>
                <DropdownItem tag={Link} to="/admin/model/info" onClick={(e) => smoothScroll()}>
                  Modelo actual
                </DropdownItem>
                <DropdownItem tag={Link} to="/admin/model/history">
                  Ver historial
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>
            <NavLink
                data-placement="bottom"
                href="admin/users"
                rel="noopener noreferrer"
              >
                <p className="d-lg d-xl">Usuarios</p>
              </NavLink>
            </NavItem>
            <NavItem>
            <NavItem>
            <NavLink
                data-placement="bottom"
                href="admin/stadistics"
                rel="noopener noreferrer"
              >
                <p className="d-lg d-xl">Estadisticas</p>
              </NavLink>
            </NavItem>
            </NavItem>
            <NavItem>
              <Button
                className="nav-link d-none d-lg-block"
                color="default"
                onClick={(e) => goBack(e)}
              >
                Volver
              </Button>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
