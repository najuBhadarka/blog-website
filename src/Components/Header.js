import React from "react";
import Container from "react-bootstrap/esm/Container";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import Navbar from "react-bootstrap/esm/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router";
import { Button, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/user/UserAction";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  return (
    <React.Fragment>
      <Navbar className="navbar">
        <Container>
          <Navbar.Brand className="logo">
            <Link to="/">Stack Summation</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
              <Nav.Link>
                <Link to="AboutUs">About Us</Link>
              </Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>

              <Button
                variant="outline-success"
                onClick={() => navigate("/Users")}
              >
                Find Users
              </Button>
            </Nav>
            <Dropdown className="drop-menu">
              <Dropdown.Toggle
                className="name"
                variant="success"
                id="dropdown-basic"
              >
                Hi, {user?.displayName}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  href="#"
                  onClick={() => navigate(`/Profile/${user?.uid}`)}
                >
                  <CgProfile /> My Profile
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => dispatch(logout())}>
                  <FiLogOut /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
};

export default Header;
