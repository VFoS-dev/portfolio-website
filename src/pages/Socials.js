import React from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import '../css/pages.css';
import '../css/socials.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pos: [0, 0],
            rot: (0)
        }
    }

    render() {
        return (
            <div className="socials">
                <div className='navpadding' />
            </div >
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedSocials = connect(mapState, actionCreators)(Socials);
export { connectedSocials as Socials };