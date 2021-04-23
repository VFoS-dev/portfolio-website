import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../css/navbar.css';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: false
        }
        // binds
        this.changePage = this.changePage.bind(this);
        this.listener = this.listener.bind(this);
        // listeners
        window.addEventListener('popstate', this.listener);
    }

    listener() {
        this.props.updatePage(this.props.last, window.location.href.split('/').splice(-1)[0].split('?')[0] || "intro");
        this.setState({ nav: false });
    }

    changePage(nav) {
        const page = window.location.href.split('/').splice(-1)[0].split('?')[0] || "intro";
        if (nav !== page) {
            const _newPage = nav || "intro";
            window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);
            this.props.updatePage(page, _newPage);

            setTimeout(() => {
                this.setState({ nav: false });
            }, 10);
        }
    }

    render() { // | intro | about | projects | resume | education | contact | secret |
        const ref = window.location.href.split('/')[3].split('?')[0];
        const { nav } = this.state;

        return (
            <Navbar className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark" bg="light" expand="lg" onToggle={() => this.setState({ nav: !nav })} expanded={nav}>
                <Navbar.Brand className="pointer" id='intro' onClick={(e) => this.changePage(e.target.id)}>Jonathan Kido</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse>
                    <Nav className="mr-auto">
                        <Nav.Link className={(ref === 'about') ? "active" : ""} id='about' onClick={(e) => this.changePage(e.target.id)}>About</Nav.Link>
                        <Nav.Link className={(ref === 'projects') ? "active" : ""} id='projects' onClick={(e) => this.changePage(e.target.id)}>Projects</Nav.Link>
                        <Nav.Link className={(ref === 'skills') ? "active" : ""} id='skills' onClick={(e) => this.changePage(e.target.id)}>Skills</Nav.Link>
                        <Nav.Link className={(ref === 'resume') ? "active" : ""} id='resume' onClick={(e) => this.changePage(e.target.id)}>Resume</Nav.Link>
                        <Nav.Link className={(ref === 'contact') ? "active" : ""} id='contact' onClick={(e) => this.changePage(e.target.id)}>Contact</Nav.Link>
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