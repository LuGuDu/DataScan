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

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'

// reactstrap components
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from "reactstrap";

export default function IndexNavbar() {

  const navigate = useNavigate();

  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [collapseOut, setCollapseOut] = React.useState("");
  const [color, setColor] = React.useState("navbar-transparent");

  React.useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return function cleanup() {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);

  const changeColor = () => {
    if (
      document.documentElement.scrollTop > 99 ||
      document.body.scrollTop > 99
    ) {
      setColor("bg-info");
    } else if (
      document.documentElement.scrollTop < 100 ||
      document.body.scrollTop < 100
    ) {
      setColor("navbar-transparent");
    }
  };

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

  const smoothScroll = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const analyze = (e) => {
    e.preventDefault();
    navigate('/analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goAdminPane = (e) => {
    e.preventDefault();
    navigate('/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const logout = (e) => {
    e.preventDefault();

    sessionStorage.setItem("userRole", 'no-logged')

    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Navbar className={"fixed-top " + color} color-on-scroll="100" expand="lg">
      <Container>
        <div className="navbar-translate">
          <PermissionsGate
            scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
          >
            <NavbarBrand to="/welcome" tag={Link} id="navbar-brand" onClick={() => smoothScroll()}>
              <span>DataScan </span>
            </NavbarBrand>
          </PermissionsGate>

          <PermissionsGate
            scopes={[SCOPES.noLoggedCanAccess]}
          >
            <NavbarBrand to="/" tag={Link} id="navbar-brand" onClick={() => smoothScroll()}>
              <span>DataScan </span>
            </NavbarBrand>
          </PermissionsGate>

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

              <PermissionsGate
                scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
              >
                <Col className="collapse-brand" xs="6">
                  <a href="/welcome" onClick={() => smoothScroll()}>
                    DataScan
                  </a>
                </Col>
              </PermissionsGate>

              <PermissionsGate
                scopes={[SCOPES.noLoggedCanAccess]}
              >
                <Col className="collapse-brand" xs="6">
                  <a href="/" onClick={() => smoothScroll()}>
                    DataScan
                  </a>
                </Col>
              </PermissionsGate>

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
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://twitter.com/"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Twitter"
              >
                <i className="fab fa-twitter" />
                <p className="d-lg-none d-xl-none">Twitter</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.facebook.com/"
                rel="noopener noreferrer"
                target="_blank"
                title="Like us on Facebook"
              >
                <i className="fab fa-facebook-square" />
                <p className="d-lg-none d-xl-none">Facebook</p>
              </NavLink>
            </NavItem>
            <NavItem className="p-0">
              <NavLink
                data-placement="bottom"
                href="https://www.instagram.com/"
                rel="noopener noreferrer"
                target="_blank"
                title="Follow us on Instagram"
              >
                <i className="fab fa-instagram" />
                <p className="d-lg-none d-xl-none">Instagram</p>
              </NavLink>
            </NavItem>
            <UncontrolledDropdown nav>
              <DropdownToggle
                caret
                color="default"
                data-toggle="dropdown"
                href="/"
                nav
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa fa-cogs d-lg-none d-xl-none" />
                More options
              </DropdownToggle>
              <DropdownMenu className="dropdown-with-icons">
                <DropdownItem tag={Link} to="/attacks_info" onClick={() => smoothScroll()}>
                  About attacks
                </DropdownItem>
                <DropdownItem tag={Link} to="/contact" onClick={() => smoothScroll()}>
                  Contact us
                </DropdownItem>
                <DropdownItem tag={Link} to="/about">
                  About us
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>

            <PermissionsGate
              scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
            >
              <NavItem>
                <Button
                  className="nav-link d-none d-lg-block"
                  color="primary"
                  onClick={(e) => analyze(e)}
                >
                  <i className="tim-icons icon-zoom-split" /> Analyze
                </Button>
              </NavItem>

              <PermissionsGate
                scopes={[SCOPES.administratorCanAccess]}
              >
                <NavItem>
                  <Button
                    className="nav-link d-none d-lg-block"
                    color="success"
                    onClick={(e) => goAdminPane(e)}
                  >
                    <i className="tim-icons icon-settings-gear-63" /> Admin pane
                  </Button>
                </NavItem>
              </PermissionsGate>

              <NavItem>
                <Button
                  className="nav-link d-none d-lg-block"
                  color="danger"
                  onClick={(e) => logout(e)}
                >
                  <i className="tim-icons icon-user-run" /> Logout
                </Button>
              </NavItem>
            </PermissionsGate>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}
