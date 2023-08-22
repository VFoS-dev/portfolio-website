import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { SecretData } from '../_data';
import { Tab, Tabs } from 'react-bootstrap';

import '../css/secret.css';

class SecretController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            update: false,
            shown: false,
        };
        this.listener = this.listener.bind(this);

        // listeners
        window.addEventListener('custom-pushState', this.listener);
    }

    listener() {
        const [_, page, secret] = window.location.pathname.split('/');
        const { update, shown } = this.state;
        if (shown && secret != 'secret' || secret == 'secret')
            this.setState({ update: !update, shown: !!secret });
    }

    remove(e) {
        var [_, page, secret] = window.location.pathname.split('/');
        if (e !== 'cancel' || !page) return;
        const { update } = this.state;
        var sub = `/${page}`;
        window.history.replaceState(sub, 'Title', sub);
        this.setState({ update: !update });
    }

    projects(page) {
        var { markdown, images } = SecretData[page]
        return <Fragment>
            <Tabs defaultActiveKey='photoshop'>
                <Tab eventKey="photoshop" title="Photoshop">
                    <div id='photoshop'>
                        <h1>Welcome to the Projects Secret</h1>
                        <p>Here you will find the intentionally "bad" photoshops images that I have created of friends</p>
                        <div className='photoshop-images'>
                            {images.map(({ img, label, name, socials, }) => {
                                return <div key={`photoshop-${name}`} style={{ '--background': `url(${img})` }} onClick={() => window.open(img, '_blank')}>
                                    <div id='photoshop-label'>{label}</div>
                                    <div className='gap' />
                                    <div id='photoshop-name'>{name}</div>
                                </div>
                            })}
                        </div>
                    </div>
                </Tab>
                <Tab eventKey="code" title="Code">
                    <zero-md src={markdown}></zero-md>
                </Tab>
            </Tabs>
        </Fragment>
    }

    render() {
        const { correct } = this.props;
        var [_, page, secret] = window.location.pathname.split('/') || []
        if (!correct || secret != 'secret') {
            if (secret == 'secret')
                setTimeout(() => this.remove('cancel'), 0)
            return <Fragment></Fragment>;
        }

        return <div className={`sticky-overlay _modal show super`} id='cancel' onClick={(e) => this.remove(e.target.id)}>
            <div className={`card ${page}`}>
                {typeof this[page] == 'function' ? this[page](page) : <Fragment>
                    Congrats on finding the secret however it is currently under construction
                </Fragment>}
            </div>

        </div>
    }
}

function mapState(state) {
    const { correct } = state.rotation;
    return { correct };
}

const actionCreators = {};

const ConnectedSecretController = connect(mapState, actionCreators)(SecretController);
export { ConnectedSecretController as SecretController };