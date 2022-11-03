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
            aniInc: true,
            queueStart: false,
            aniStart: false,
            animateLogo: false
        }
        // binds
        this.changePage = this.changePage.bind(this);
        this.listener = this.listener.bind(this);
        this.queue = this.queue.bind(this);
        this.aniLogo = this.aniLogo.bind(this);
        // listeners
        window.addEventListener('popstate', this.listener);
    }

    async queue() {
        this.setState({ queueStart: true })
        while (this.state.frame !== this.props.logoFrame) {
            await this.timeout(25)
            const { frame } = this.state
            const { logoFrame } = this.props;
            this.setState({ frame: `00${Math.min(Math.max(0, parseInt(frame) + (parseInt(logoFrame) > parseInt(frame) ? 1 : -1)), 18)}`.slice(-2) })
        }
        this.setState({ queueStart: false })
    }

    async aniLogo() {
        this.setState({ aniStart: true })
        while (this.state.animateLogo) {
            const { frame, aniInc } = this.state
            await this.timeout(20)
            this.setState({
                aniInc: parseInt(frame) == 0 ? true : (parseInt(frame) == 18 ? false : aniInc),
            })
            await this.timeout(10)
            this.setState({
                frame: `00${Math.max(Math.min(parseInt(frame) + (aniInc ? 1 : -1), 18), 0)}`.slice(-2)
            })
            await this.timeout(20)
        }
        this.setState({ aniStart: false })
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
                this.setState({
                    nav: false
                });
            }, 0);
        }
    }

    render() { // | intro | about | projects | resume | education | contact | secret |
        const ref = window.location.href.split('/')[3].split('?')[0];
        const { nav, frame, queueStart, animateLogo, aniStart } = this.state;
        const { logoFrame, secretLength, checkpoints, correct } = this.props;
        if (!animateLogo && frame !== logoFrame && !queueStart && !aniStart) this.queue()
        if (animateLogo && !aniStart) this.aniLogo()

        return (
            <Navbar className="navbar navbar-expand-lg fixed-top bg-transparent disable" bg="light" expand="lg" onToggle={() => this.setState({ nav: !nav })} expanded={nav}>
                <div className='navShadow'>

                </div>
                <Navbar.Brand className="pointer enable z-2" id='intro' style={{ position: 'relative' }} onClick={(e) => this.changePage(e.target.id)} onMouseOut={() => this.setState({ animateLogo: false })} onMouseOver={() => this.setState({ animateLogo: true })}>
                    <img src={`/images/nav/${frame || "18"}.png`} alt='VFoS.dev' style={{ width: "min(10vh, 10vw)" }} />
                    <div className='disable' style={{ position: 'absolute', display: 'flex', top: 0, left: 'min(11vh, 11vw)', height: '30%', marginRight: '15px', marginTop: '1vh' }}>
                        {[...new Array(secretLength)].map((c, index) => (<div className={`checkpoint${correct ? " complete" : checkpoints[index] ? " correct" : typeof checkpoints[index] == 'boolean' ? " wrong" : ''}`}>
                            <div />
                        </div>))}
                    </div>
                </Navbar.Brand>
                <Navbar.Toggle className='enable z-2' />
                <Navbar.Collapse className='disable z-2'>
                    <Nav className="mr-auto">
                        <Nav.Link className={((ref === 'about') ? "active" : "") + " lato enable"} id='about' onClick={(e) => this.changePage(e.target.id)}>About</Nav.Link>
                        <Nav.Link className={((ref === 'projects') ? "active" : "") + " lato enable"} id='projects' onClick={(e) => this.changePage(e.target.id)}>Projects</Nav.Link>
                        <Nav.Link className={((ref === 'skills') ? "active" : "") + " lato enable"} id='skills' onClick={(e) => this.changePage(e.target.id)}>Skills</Nav.Link>
                        <Nav.Link className={((ref === 'resume') ? "active" : "") + " lato enable"} id='resume' onClick={(e) => this.changePage(e.target.id)}>Resume</Nav.Link>
                        <Nav.Link className={((ref === 'socials') ? "active" : "") + " lato enable"} id='socials' onClick={(e) => this.changePage(e.target.id)}>Socials</Nav.Link>
                        {correct && <Nav.Link className={((ref === 'secret') ? "active" : "") + " lato enable"} id='secret' onClick={(e) => this.changePage(e.target.id)}>Secret</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
            </Navbar >
        );
    }
}

function mapState(state) {
    const { checkpoints, correct, secretLength } = state.rotation
    return { checkpoints, correct, secretLength };
}

const actionCreators = {};

const connectedNavBar = connect(mapState, actionCreators)(NavBar);
export { connectedNavBar as NavBar };