import React from 'react';
import { connect } from 'react-redux';

import '../css/router.css';

// Components
import { NavBar } from './NavBar';
// Pages
import { About, Contact, Education, Intro, Projects, Resume } from '../pages';

class CustomRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            update: false,
            animate: true,
            animations: true,
            aniTimer: null,
            loc: 'front',
            queue: false
        }
        this.updatePage = this.updatePage.bind(this);
    }

    updatePage(_page, _new) { // animated
        const { rotation } = this.props;

        const loc = JSON.stringify(rotation).split(`":"${_new}"`)[0].split('"').slice(-1)[0];
        if (loc === "front") {
            this.setState({ animate: false })
            return;
        }

        const { aniTimer, animations, update } = this.state;
        if (aniTimer) window.clearTimeout(aniTimer);

        var timer = setTimeout(() => {
            this.setState({ animate: false })
        }, 1000);
        var queue = (_new === _page) ? false : _page;


        this.setState({ update: !update, animate: animations, aniTimer: timer, loc: loc, queue: queue });

        this.props.rotate(loc)
    }

    Router(req) { // actual router
        switch (req) {
            default:
            case 'intro':
                return <Intro />
            case 'projects':
                return <Projects />
            case 'resume':
                return <Resume />
            case 'education':
                return <Education />
            case 'contact':
                return <Contact />
            case 'about':
                return <About />
        }
    }

    render() {
        const { animate, loc, queue, update } = this.state;
        const { rotation } = this.props;

        const page = window.location.href.split('/').splice(-1)[0].split('?')[0];
        if (rotation.front !== page) this.props.rotate(JSON.stringify(rotation).split(`":"${page}`)[0].split('"').splice(-1)[0]);

        return (<>
            <NavBar id={`nav_${update}`} updatePage={this.updatePage} />
            <div className="cube-container">
                {/* hi */}
                {!!queue && animate && <>
                    < div className={`face prior ani-${loc}`}>{this.Router(queue)}</div>
                    {loc === "back" &&
                        <div className={`face skip ani-back`}>{this.Router(rotation.top)}</div>
                    }
                </>}
                <div className={`face focus${animate && !!queue ? ` ani-${loc}` : ""}`}>{this.Router(page)}</div>
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