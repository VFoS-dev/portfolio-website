import React, { Fragment } from 'react';
import { connect } from 'react-redux';

class Resume extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="resume">
                <div className='navpadding' />
                <center className='demoSpacing'>
                    <h2>THIS PAGE IS UNDER CONSTRUCTION</h2>
                </center>
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedResume = connect(mapState, actionCreators)(Resume);
export { connectedResume as Resume };