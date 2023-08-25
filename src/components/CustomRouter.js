import React, { Fragment } from 'react';
import { connect } from 'react-redux';

// CSS
import '../css/router.css';

// Components
import { NavBar } from './NavBar';

// Pages
import { About, Socials, Skills, Intro, Projects, Resume } from '../pages';
import { SecretController } from './SecretController';
import { AchievementNotification } from './AchievementNotification';

class CustomRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update: false,
            animate: false,
            animations: true,
            aniTimer: null,
            loc: 'front',
            winloc: '',
            queue: false,
            scrollPercent: 1,
            cantRot: false
        };

        this.updatePage = this.updatePage.bind(this);
        this.keyRot = this.keyRot.bind(this);
        this.changeRot = this.changeRot.bind(this);

        document.addEventListener('keydown', this.keyRot);
        window.addEventListener('custom-changeRot', this.changeRot);
    }

    changeRot = (e) => this.setState({ cantRot: e.detail })

    keyRot(e) {
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

        const { rotation } = this.props;
        const { cantRot } = this.state;
        const [_, page, secret] = window.location.pathname.split('/') || []
        if (rotation.correct && secret === 'secret' || cantRot) return

        const _newPage = rotation[p] || "intro";

        window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);

        this.updatePage(page, _newPage);

        document.removeEventListener('keydown', this.keyRot);
        setTimeout(() => {
            document.addEventListener('keydown', this.keyRot);
        }, 300)
    }

    updatePage(_page, _new) {
        const _newpage = _new.split('/')[0];
        const { rotation } = this.props;
        const { loc, animate, aniTimer, animations, update } = this.state;

        const _loc = JSON.stringify(rotation).split(`":"${_newpage}"`)[0].split('"').slice(-1)[0];

        window.dispatchEvent(new CustomEvent("custom-pushState", { loc }));

        if (_loc === "front") {
            this.setState({ animate: false });
            return;
        }
        if (animate && loc !== 'front' && loc === _loc) {
            var e0 = document.getElementsByClassName(`ani-${loc}`);
            while (e0.length > 0) e0[0].classList.remove(`ani-${loc}`);
            setTimeout(() => {
                document.getElementsByClassName(`focus`)[0].classList.add(`ani-${loc}`);
                document.getElementsByClassName(`prior`)[0].classList.add(`ani-${loc}`);
                if (loc === "back")
                    document.getElementsByClassName(`skip`)[0].classList.add(`ani-${loc}`);
            }, 10)
        }

        if (aniTimer) window.clearTimeout(aniTimer);
        var timer = setTimeout(() => this.setState({ animate: false }), 1000);

        var queue = (_newpage !== _page) ? _page : false;

        this.props.rotate(_loc);
        this.setState({ update: !update, animate: animations, aniTimer: timer, loc: _loc, queue: queue });
    }

    async UpdateNavBar() {
        const f = document.getElementById("focused")

        var _scroll = (document.documentElement.clientHeight < f.scrollHeight) ? f.scrollTop / Math.min(f.scrollHeight - f.offsetHeight, f.scrollHeight) : 1;

        const { scrollPercent } = this.state;
        if (_scroll !== scrollPercent) this.setState({
            scrollPercent: _scroll
        });
    }

    Router(req, active) { // actual router
        const { scrollPercent, animate } = this.state;
        switch (req) {
            default:
            case 'intro': return <Intro key="Intro" activePage={active} />;
            case 'projects': return <Projects key="Projects" activePage={active} updatePage={this.updatePage} />;
            case 'resume': return <Resume key="Resume" activePage={active} updatePage={this.updatePage} />;
            case 'skills': return <Skills key="Skills" activePage={active} animating={animate} scrolled={scrollPercent} />;
            case 'socials': return <Socials key="Socials" activePage={active} animating={animate} />;
            case 'about': return <About key="About" activePage={active} />;
        }
    }

    removeLoading = () => document.getElementById('loading').style = 'display: none;';

    render() {
        const { animate, loc, queue, scrollPercent } = this.state;
        const { rotation } = this.props;
        const [_, page, secret] = window.location.pathname.split('/');
        if (!!page && rotation.front !== page) this.props.rotate(JSON.stringify(rotation).split(`":"${page} `)[0].split('"').splice(-1)[0]);
        return (<Fragment>
            <SecretController />
            <AchievementNotification />
            <NavBar updatePage={this.updatePage} last={page} scrollPercent={scrollPercent} />
            <div className="cube-container" style={{ perspective: `${document.documentElement.clientWidth}px` }} onAnimationEnd={() => this.removeLoading()}>
                {!!queue && animate && <>
                    <div className={`face prior ani-${loc} ${queue}`} key={queue}>
                        {this.Router(queue, false)}
                    </div>
                    {loc === "back" &&
                        <div className={`face skip ani-back ${rotation.bottom}`} key={rotation.bottom}>
                            {/* using bottom to grab the top because the value of the sides have already swapped */}
                            {this.Router(rotation.bottom, false)}
                        </div>
                    }
                </>}
                <div id="focused" key={page} className={`face focus${animate && !!queue ? ` ani-${loc}` : ""} ${page}`} onScroll={() => this.UpdateNavBar()}>
                    {this.Router(page, true)}
                </div>
            </div>
        </Fragment>);
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

var connectedCustomRouter = connect(mapState, actionCreators)(CustomRouter);
export { connectedCustomRouter as CustomRouter };