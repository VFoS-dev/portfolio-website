import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../css/navbar.css';

class NavBar extends Component {
    constructor(props) {
        super(props);

        this.random = this.random.bind(this);
    }

    random(nav) {
        const page = window.location.href.split('/')[3].split('?')[0];
        const _newPage = nav || "intro";
        window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);
        this.props.updatePage(page, _newPage);
    }

    render() { // | intro | about | projects | resume | education | contact | secret |
        const ref = window.location.href.split('/')[3].split('?')[0];
        return (
            <Navbar className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark" bg="light" expand="lg">
                <Navbar.Brand className="pointer" id='intro' onClick={(e) => this.random(e.target.id)}>Jonathan Kido</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link className={(ref === 'about') ? "active" : ""} id='about' onClick={(e) => this.random(e.target.id)}>About</Nav.Link>
                        <Nav.Link className={(ref === 'projects') ? "active" : ""} id='projects' onClick={(e) => this.random(e.target.id)}>Projects</Nav.Link>
                        <Nav.Link className={(ref === 'resume') ? "active" : ""} id='resume' onClick={(e) => this.random(e.target.id)}>Resume</Nav.Link>
                        <Nav.Link className={(ref === 'education') ? "active" : ""} id='education' onClick={(e) => this.random(e.target.id)}>Education</Nav.Link>
                        <Nav.Link className={(ref === 'contact') ? "active" : ""} id='contact' onClick={(e) => this.random(e.target.id)}>Contact</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedNavBar = connect(mapState, actionCreators)(NavBar);
export { connectedNavBar as NavBar };