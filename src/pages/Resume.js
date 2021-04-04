import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Resume extends React.Component {
    render() {
        return (<div className="resume">
            This Website is still a work in progress
        </div>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedResume = connect(mapState, actionCreators)(Resume);
export { connectedResume as Resume };