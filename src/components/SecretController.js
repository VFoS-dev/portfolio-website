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
                                return <div key={`photoshop-${name}`} style={{ '--background': `url(${img})` }}>
                                    <div id='photoshop-label'>{label}</div>
                                    <div className='gap'/>
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
                <div style={{ position: 'absolute', top: '0', right: 0 }} className='pointer' id='cancel' onClick={(e) => this.remove(e.target.id)}>
                    <svg className='disable' stroke="black" fill="black" strokeWidth="0" viewBox="0 0 1024 1024" height="3em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </div>
                {typeof this[page] == 'function' ? this[page](page) : <Fragment>
                    Congrats on finding the secret however it is currently under construction
                </Fragment>}
                {/*<zero-md src="/markdown/testreadme.md"></zero-md>*/}
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