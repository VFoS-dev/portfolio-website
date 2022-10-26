import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '../css/navbar.css';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: false,
            timeout: null,
            frame: "18",
            queueStart: false
        }
        // binds
        this.changePage = this.changePage.bind(this);
        this.listener = this.listener.bind(this);
        this.queue = this.queue.bind(this);
        // listeners
        window.addEventListener('popstate', this.listener);
    }

    async queue() {
        const { frame } = this.state
        const { logoFrame } = this.props;
        this.setState({ queueStart: true })
        while (frame !== logoFrame) {
            await this.timeout(25)
            this.setState({ frame: `00${parseInt(frame) + (parseInt(logoFrame) > parseInt(frame) ? 1 : -1)}`.slice(-2) })
            break;
        }
        this.setState({ queueStart: false })
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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
        const { nav, frame, queueStart } = this.state;
        const { logoFrame } = this.props;

        if (frame !== logoFrame && !queueStart) this.queue()

        return (
            <Navbar className="navbar navbar-expand-lg navbar-light fixed-top bg-transparent" bg="light" expand="lg" onToggle={() => this.setState({ nav: !nav })} expanded={nav}>
                <Navbar.Brand className="pointer" id='intro' onClick={(e) => this.changePage(e.target.id)}>
                    <img src={`/images/nav/${frame || "18"}.png`} alt='VFoS.dev' style={{ width: "min(10vh, 10vw)" }} />
                </Navbar.Brand>
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