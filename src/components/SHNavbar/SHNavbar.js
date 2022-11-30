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
    <Navbar bg="dark" variant="dark" sticky="top">
      <Navbar.Brand as={Link} to={navLinks[0].path}>SHOP HELPER</Navbar.Brand>
      <Nav className="mx-auto">
        {navLinks.map((link, index) => (
          <Nav.Link
            as={Link}
            to={link.path}
            active={location.pathname === link.path}
            key={index}
          >
            {link.name}
          </Nav.Link>
        ))}
      </Nav>
      <div>
        <Navbar.Text>
          Signed in as: <a href="#login">Nirmal</a>
        </Navbar.Text>
        <Button variant="secondary" size="sm" className="ml-3">
          Sign Out
        </Button>
      </div>
    </Navbar>
  );
};

export default SHNavbar;
