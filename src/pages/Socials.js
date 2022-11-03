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
                {!sent ?
                    <Form className='form' onSubmit={this.sendEmail}>
                        <Row>
                            <Form.Group className='email' controlId="formEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter your email" />
                            </Form.Group>
                            <Form.Group className='name' controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control placeholder="Enter your name" />
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="formSubject">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control placeholder="Email's Subject" />
                        </Form.Group>
                        <Form.Group controlId="form Text">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className='text' as="textarea" rows={1} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Send</Button>
                    </Form>
                    :
                    <div className='message'>Thank you for your intrest, but unfortunately this feature is not fully implemented yet</div>
                }
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