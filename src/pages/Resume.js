import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import '../css/pages.css';


class Resume extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showResume: false
        }
    }
    render() {
        const { showResume } = this.state;
        return (
            <div className="resume">
                <div className='navpadding' />
                <center>
                    <h1 className='lato-title'>Resume</h1>
                    {showResume && <Fragment>
                        <br />
                        <br />
                        <embed src='/pdf/resume.pdf' style={{ width: "85%", height: "85vh", }} />
                    </Fragment>}
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