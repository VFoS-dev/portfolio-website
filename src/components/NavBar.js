import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap';
import '../css/navbar.css';
import { checkAchievement, resetCube } from '../_actions/user.actions';
import { hasAchievement } from '../_reducers/achievements';

class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nav: false,
            timeout: null,
            aniInc: true,
        }

        // binds
        this.changePage = this.changePage.bind(this);
        this.listener = this.listener.bind(this);
        this.reset = this.reset.bind(this);

        // listeners
        window.addEventListener('popstate', this.listener);
    }

    listener() {
        const [, page,] = window.location.pathname.split('/');
        window.dispatchEvent(new CustomEvent("custom-pushState"));
        this.props.updatePage(this.props.last, page);
    }

    changePage(nav) {
        const [, page,] = window.location.pathname.split('/');
        if (nav !== page) {
            const _newPage = nav || "intro";
            window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);
            this.props.updatePage(page, _newPage);

            setTimeout(() => {
                this.setState({
                    nav: false
                });
            }, 0);
        }
    }

    reset(e) {
        e.preventDefault();

        this.changePage('intro')
        this.props.checkAchievement('secretreset')
        setTimeout(() => {
            this.props.resetCube()
        }, 10)
    }

    render() { // | intro | about | projects | resume | education | contact |
        const [, ref, secret] = window.location.pathname.split('/');
        const { nav } = this.state;
        const { history, secretLength, checkpoints, correct } = this.props;
        const f = document.getElementById('focused')

        const _scrollPercent = f ? (document.documentElement.clientHeight >= f.scrollHeight) ? 1 : (f.scrollHeight === 0) ? 0 : f.scrollTop / Math.min(f.scrollHeight - f.offsetHeight, f.scrollHeight) : 1;

        this.props.checkAchievement('secretfail', checkpoints);
        if (history.length == 10) this.props.checkAchievement('secretfailall', checkpoints);

        return (<Navbar key='lg' bg="dark" expand='lg' className="navbar navbar-expand-lg fixed-top bg-transparent disable" expanded={nav} onToggle={() => this.setState({ nav: !nav })}>
            <Navbar.Brand className="brand pointer enable z-2" style={{ position: 'relative' }} onClick={(e) => this.changePage(e.target.id)}>
                <div className='navImage' style={{ '--frame': `${Math.round((_scrollPercent) * 16)}`, backgroundImage: `url(/images/nav/logosprite.webp)` }} onMouseOut={() => this.setState({ animateLogo: false })} onMouseEnter={() => this.setState({ animateLogo: true })} />
                <div className='disable checkpoint-container' onClick={this.reset}>
                    {[...new Array(secretLength)].map((c, index) => (<div key={index + "checkpoints"} className={`checkpoint${correct ? " complete" : checkpoints[index] ? " correct" : typeof checkpoints[index] == 'boolean' ? " wrong" : ''}`}><div /></div>))}
                </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" className="enable hamButton" />
            <div className='navShadow' />
            <Container fluid className="z-2">
                <Navbar.Offcanvas
                    id="offcanvasNavbar-expand-lg"
                    aria-labelledby="offcanvasNavbarLabel-expand-lg"
                    placement="end"
                    className='greyBG'
                >
                    <Offcanvas.Header>
                        <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                            VFoS.dev
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="mr-auto">
                            <Nav.Link className={((ref === 'about') ? "active" : "") + " lato enable"} id='about' onClick={(e) => this.changePage(e.target.id)}>About</Nav.Link>
                            <Nav.Link className={((ref === 'projects') ? "active" : "") + " lato enable"} id='projects' onClick={(e) => this.changePage(e.target.id)}>Projects</Nav.Link>
                            <Nav.Link className={((ref === 'skills') ? "active" : "") + " lato enable"} id='skills' onClick={(e) => this.changePage(e.target.id)}>Skills</Nav.Link>
                            <Nav.Link className={((ref === 'resume') ? "active" : "") + " lato enable"} id='resume' onClick={(e) => this.changePage(e.target.id)}>Resume</Nav.Link>
                            <Nav.Link className={((ref === 'socials') ? "active" : "") + " lato enable"} id='socials' onClick={(e) => this.changePage(e.target.id)}>Socials</Nav.Link>
                            {correct && <Nav.Link className={((secret === 'secret') ? "active" : "") + " lato enable"} id='secret' onClick={() =>
                                this.changePage((hasAchievement('secretStart') ? ref : 'intro') + '/secret')
                            }>Secret</Nav.Link>}
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>);
    }
}

function mapState(state) {
    const { checkpoints, correct, secretLength, history } = state.rotation;
    return { checkpoints, correct, secretLength, history };
}

const actionCreators = {
    checkAchievement,
    resetCube
};

const connectedNavBar = connect(mapState, actionCreators)(NavBar);
export { connectedNavBar as NavBar };