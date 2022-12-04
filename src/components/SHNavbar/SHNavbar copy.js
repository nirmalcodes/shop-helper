import React from "react";
import { Button, Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Koko Calc",
    path: "/kokocalc",
  },
  {
    name: "Barcode Generator",
    path: "/barcodegen",
  },
];

const SHNavbar = () => {
  const location = useLocation();

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#link">Link</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default SHNavbar;
