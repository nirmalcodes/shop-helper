import React, { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar
      onMouseLeave={() => setExpanded(false)}
      bg="dark"
      variant="dark"
      fixed="top"
      expand="lg"
      expanded={expanded}
    >
      <Navbar.Brand
        as={Link}
        to={navLinks[0].path}
        onClick={() => setExpanded(false)}
      >
        SHOP HELPER
      </Navbar.Brand>
      <Navbar.Toggle
        aria-controls="basic-navbar-nav"
        onClick={() => setExpanded(expanded ? false : "expanded")}
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          {navLinks.map((link, index) => (
            <Nav.Link
              as={Link}
              to={link.path}
              active={location.pathname === link.path}
              key={index}
              onClick={() => setExpanded(false)}
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
      </Navbar.Collapse>
    </Navbar>
  );
};

export default SHNavbar;
