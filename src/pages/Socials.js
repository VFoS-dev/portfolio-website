import React from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { connect } from 'react-redux';

import '../css/pages.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changed: false,
            sent: false,
            userEmail: '',
            name: '',
            subject: '',
            text: ''
        }
        this.sendEmail = this.setEmail.bind(this);
    }

    setEmail(e) {
        e.preventDefault();
        this.setState({ sent: true });
    }

    render() {
        const { sent } = this.state;
        return (
            <div className="contact">
                <div className='navpadding' />
                <center className='demoSpacing'>
                    <h2>THIS PAGE IS UNDER CONSTRUCTION</h2>
                </center>
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