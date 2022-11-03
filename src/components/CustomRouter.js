import React from 'react';
import { connect } from 'react-redux';

// CSS
import '../css/router.css';
import '../css/stars.css';
// Components
import { NavBar } from './NavBar';
// Pages
import { About, Socials, Skills, Intro, Projects, Resume } from '../pages';

class CustomRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update: false,
            animate: true,
            animations: true,
            aniTimer: null,
            loc: 'front',
            queue: false,
            logoFrame: "18",
            scrollPer: 0
        }

        this.updatePage = this.updatePage.bind(this);
        this.keyRot = this.keyRot.bind(this);
        this.focusRef = React.createRef();
        document.addEventListener('keydown', this.keyRot);
    }

    keyRot(e) {
        const { rotation } = this.props;

        var p;
        switch (e.keyCode) {
            case 38: // up
                p = "top";
                break;
            case 40: // down
                p = "bottom";
                break;
            case 37: // left
                p = "left";
                break;
            case 39: // right
                p = "right";
                break;
            default:
                return;
        }

        const _newPage = rotation[p] || "intro";
        const page = window.location.href.split('/').splice(-1)[0].split('?')[0] || "intro";

        window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);

        this.updatePage(page, _newPage);

        document.removeEventListener('keydown', this.keyRot);
        setTimeout(() => {
            document.addEventListener('keydown', this.keyRot);
        }, 300)
    }

    updatePage(_page, _new) {
        const { rotation } = this.props;
        const { loc, animate, aniTimer, animations, update } = this.state;

        const _loc = JSON.stringify(rotation).split(`":"${_new}"`)[0].split('"').slice(-1)[0];

        if (_loc === "front") {
            this.setState({ animate: false });
            return;
        }
        var extend = false
        if (animate && loc !== 'front' && loc === _loc) {
            var e0 = document.getElementsByClassName(`ani-${loc}`);
            while (e0.length > 0) e0[0].classList.remove(`ani-${loc}`);
            setTimeout(() => {
                document.getElementsByClassName(`focus`)[0].classList.add(`ani-${loc}`);
                document.getElementsByClassName(`prior`)[0].classList.add(`ani-${loc}`);
                if (loc === "back")
                    document.getElementsByClassName(`skip`)[0].classList.add(`ani-${loc}`);
            }, 6)
            extend = true;
        }

        if (aniTimer) window.clearTimeout(aniTimer);
        var timer = setTimeout(() => this.setState({ animate: false }), 1000 + 6 * (extend));

        var queue = (_new !== _page) ? _page : false;

        this.props.rotate(_loc);

        this.setState({ update: !update, animate: animations, aniTimer: timer, loc: _loc, queue: queue });
    }

    UpdateNavBar(e) {
        const { logoFrame } = this.state
        if (e.scrollTop === 0) {
            console.log(e.offsetHeight, e.scrollHeight);
            if (e.offsetHeight <= e.scrollHeight) this.setState({ logoFrame: "00" })
            else this.setState({
                logoFrame: "18",
                scrollPer: e.scrollTop
            })
        } else {
            var screen = `00${Math.round((e.scrollTop / Math.min(e.scrollHeight - e.offsetHeight, e.scrollHeight)) * 18)}`.slice(-2)
            if (screen != logoFrame) this.setState({
                logoFrame: screen,
                scrollPer: e.scrollTop
            })
        }
    }

    Router(req) { // actual router
        const { scrollPer } = this.state;
        switch (req) {
            default:
            case 'intro':
                return <Intro />
            case 'projects':
                return <Projects />
            case 'resume':
                return <Resume />
            case 'skills':
                return <Skills scrolled={scrollPer} />
            case 'socials':
                return <Socials />
            case 'about':
                return <About />
        }
    }

    render() {
        const { animate, loc, queue, logoFrame } = this.state;
        const { rotation } = this.props;

        const page = window.location.href.split('/').splice(-1)[0].split('?')[0];
        if (!!page && rotation.front !== page)
            this.props.rotate(JSON.stringify(rotation).split(`":"${page}`)[0].split('"').splice(-1)[0]);


        const f = document.getElementById("focused")
        if (f?.offsetHeight < f?.scrollHeight && logoFrame == 18) this.UpdateNavBar(f)
        else if (f?.offsetHeight > f?.scrollHeight && logoFrame < 18) this.setState({ logoFrame: "18" })


        return (<>
            <NavBar updatePage={this.updatePage} last={page} logoFrame={logoFrame} />
            <div style={{ width: "100vw", height: "100vh", overflow: 'hidden', background: "black", position: "fixed" }}>
                <div id='stars' />
                <div id='stars2' />
                <div id='stars3' />
                <div id='stars' className='right' />
                <div id='stars2' className='right' />
                <div id='stars3' className='right' />
            </div>
            <div className="cube-container" style={{ perspective: `${document.documentElement.clientWidth}px` }}>
                {/* hi */}
                {!!queue && animate && <>
                    <div className={`face prior ani-${loc}`} key={queue}>
                        {this.Router(queue)}
                    </div>
                    {loc === "back" &&
                        <div className={`face skip ani-back`} key={rotation.bottom}>
                            {/* using bottom to grab the top because the value of the sides have already swapped */}
                            {this.Router(rotation.bottom)}
                        </div>
                    }
                </>}
                <div id="focused" key={page} className={`face focus${animate && !!queue ? ` ani-${loc}` : ""}`} ref={this.focusRef} onScroll={(e) => this.UpdateNavBar(e.currentTarget)}>
                    {this.Router(page)}
                </div>
            </div>
        </>);
    }
}

function mapState(state) {
    const { rotation } = state;
    return { rotation };
}

const actionCreators = {
    rotate: rotateCube
};

function rotateCube(pos) {
    return dispatch => { dispatch({ type: pos }) }
}

const connectedCustomRouter = connect(mapState, actionCreators)(CustomRouter);
export { connectedCustomRouter as CustomRouter };