import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/intro.css';

class Intro extends React.Component {
    render() {
        return (
            <Fragment>
                <div className="intro">
                    <div className='navpadding' />
                    <center>
                        <h1 style={{ color: 'rgb(204, 158, 73)' }}>Welcome to my portfolio site!</h1>
                    </center>
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