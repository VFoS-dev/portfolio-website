import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Contact extends React.Component {
    render() {
        return (<>
            <div className="side1">This Website is still a work in progress</div>
        </>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedContact = connect(mapState, actionCreators)(Contact);
export { connectedContact as Contact };