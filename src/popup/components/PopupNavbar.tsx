import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";

const PopupNavbar = () => {
  return (
    <Navbar expand="sm" className="bg-dark">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="/logo.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="Coupon Clipper logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="popup-navbar-nav" />
        <Navbar.Collapse id="popup-navbar-nav" className="text-light">
          <Nav className="me-auto">
            <Nav.Link
              href="https://github.com/patthomasrick-o/coupon-clipper-extension"
              className="text-light"
            >
              GitHub
            </Nav.Link>
            <Nav.Link href="https://patrickwthomas.net" className="text-light">
              patrickwthomas.net
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default PopupNavbar;
