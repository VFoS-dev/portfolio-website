import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Intro extends React.Component {
    render() {
        return (<div className="intro">
            <div className='navpadding' />
            <center>
                <h1>Welcome to my portfolio site!</h1>
            </center>
            <center className='demoSpacing'>
                <h2>THIS PAGE IS UNDER CONSTRUCTION</h2>
            </center>
        </div>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedIntro = connect(mapState, actionCreators)(Intro);
export { connectedIntro as Intro };