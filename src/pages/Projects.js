import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Projects extends React.Component {
    render() {
        return (<>
            <div className="side4">This Website is still a work in progress</div>
        </>);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedProjects = connect(mapState, actionCreators)(Projects);
export { connectedProjects as Projects };