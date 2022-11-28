import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/intro.css';

class Intro extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="intro">
                    <div className='backdrop'>
                        <div class="cube"></div>
                        <div class="cube"></div>
                        <div class="cube"></div>
                        <div class="cube"></div>
                        <div class="cube"></div>
                        <div class="cube"></div>
                    </div>
                    <div className='center'>
                        <center className="welcome">
                            <h1>Welcome to my portfolio site!</h1>
                            <h2>You can use the links up top or the arrow keys to navigate the cube.</h2>
                            <h3>Each page references something different and some have minigames.</h3>
                            <h4>You may notice red and green lights up top as you move around the website.</h4>
                            <h5 >See if you can get them all green to view an easter egg page!</h5>
                        </center>
                    </div>
                </div>

            </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedIntro = connect(mapState, actionCreators)(Intro);
export { connectedIntro as Intro };