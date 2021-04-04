import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Intro extends React.Component {
    render() {
        return (<div className="intro">
            This Website is still a work in progress
        </div>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedIntro = connect(mapState, actionCreators)(Intro);
export { connectedIntro as Intro };