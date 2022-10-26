import React from 'react';
import { connect } from 'react-redux';
import '../css/pages.css';


class Resume extends React.Component {
    render() {
        return (
            <div className="resume">
                <center>
                    <h1>Resume last updated: <strong>August 2022</strong></h1>
                    <br />
                    <br />
                    <embed src='/pdf/resume.pdf' style={{ width: "85%", height: "85vh", }} />
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