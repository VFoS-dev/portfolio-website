import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class About extends React.Component {
    render() {
        return (<>
            <div className="side2">This Website is still a work in progress</div>
        </>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedAbout = connect(mapState, actionCreators)(About);
export { connectedAbout as About };