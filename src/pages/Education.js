import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Education extends React.Component {
    render() {
        return (<div className="education">
            This Website is still a work in progress
        </div>);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedEducation = connect(mapState, actionCreators)(Education);
export { connectedEducation as Education };