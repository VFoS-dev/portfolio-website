import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { SecretData } from '../_data';
import { Tab, Tabs } from 'react-bootstrap';

import '../css/secret.css';
import { checkAchievement } from '../_actions/user.actions';

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
        const [, , secret] = window.location.pathname.split('/');
        const { update, shown } = this.state;
        if (shown && secret != 'secret' || secret == 'secret')
            this.setState({ update: !update, shown: !!secret });
    }

    remove(e) {
        const [, page,] = window.location.pathname.split('/');
        if (e !== 'cancel' || !page) return;
        const { update } = this.state;
        window.history.replaceState(`/${page}`, 'Title', `/${page}`);
        this.setState({ update: !update });
    }

    intro(page) {
        return <Fragment>
            <h1>Congratulations!</h1>
            <div class='email'>
                Dear Amazing Explorer,<br id='n2' />
                I am thrilled to inform you that your curiosity and tenacity have paid off! You've discovered a hidden treasure - the secret page! But wait, the adventure doesn't end here. This website is brimming with more secrets waiting to be unveiled. Each webpage holds a unique surprise, a hidden gem that will make your journey even more exhilarating.<br id='n2' />
                So, put on your virtual hiking boots and continue your expedition through this digital cube. Who knows what marvels you'll unearth next? Remember, every click, every link, and every corner you explore might lead you to another thrilling discovery.<br id='n2' />
                If you ever wonder what other interactive features are on the page, just click on the secret - there's a unique secret on each page, waiting to be revealed!<br id='n2' />
                Thank you for being a part of this quest for hidden wonders. Your curiosity lights up this virtual realm, and we can't wait to see what mysteries you'll unravel next.<br id='n2' />
                Happy exploring!<br id='n2' />
                Best regards,<br />
                Jon Kido
            </div>
        </Fragment>
    }

    markdown = (markdown) => <zero-md src={markdown}></zero-md>;

    photoshop = (info = []) => (<Fragment>
        <div id='photoshop'>
            <h1>Welcome to the Projects Secret</h1>
            <p>Here you will find the intentionally "bad" photoshops images that I have created of friends</p>
            <div className='photoshop-images'>
                {info.map(({ img, label, name, socials, }) => {
                    return <div key={`photoshop-${name}`} style={{ '--background': `url(${img})` }} onClick={() => window.open(img, '_blank')}>
                        <div id='photoshop-label'>{label}</div>
                        <div className='gap' />
                        <div id='photoshop-name'>{name}</div>
                    </div>
                })}
            </div>
        </div>
    </Fragment>);

    handleInternals(type, data) {
        if (!data) return ''
        let labels = {
            photoshop: 'Exclusive',
            markdown: 'Code',
        };
        if (typeof this[type] === 'function')
            return <Tab eventKey={type} title={labels[type]}>{this[type](data)}</Tab>;

        console.error(`ERROR: view not created for spliceData->handleInternals('${type}', *)`);
    }

    spliceData(page) {
        var dataSet = SecretData[page]
        let order = ['photoshop', 'markdown',];
        const defaultActive = dataSet?.default;
        return <Fragment>
            <Tabs defaultActiveKey={defaultActive}>
                {order.map(o => this.handleInternals(o, dataSet[o]))}
            </Tabs>
        </Fragment>
    }

    render() {
        const { correct } = this.props;
        const [, page, secret] = window.location.pathname.split('/')
        if (!correct || secret != 'secret') {
            if (secret == 'secret')
                setTimeout(() => this.remove('cancel'), 0)
            return <Fragment></Fragment>;
        }

        this.props.checkAchievement('secretStart')
        this.props.checkAchievement('secretPage', `${page}/${secret}`)
        this.props.checkAchievement('secretAll', `${page}/${secret}`)
        this.props.checkAchievement('secretphotoshop', `${page}/${secret}`)

        let content;
        if (typeof this[page] === 'function') {
            content = this[page](page)
        } else if (SecretData[page]) {
            content = this.spliceData(page)
        }

        return <div className={`sticky-overlay _modal show super`} id='cancel' onClick={(e) => this.remove(e.target.id)}>
            <div className={`card secret ${page}`}>
                {content || <Fragment>
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

const actionCreators = {
    checkAchievement
};

const ConnectedSecretController = connect(mapState, actionCreators)(SecretController);
export { ConnectedSecretController as SecretController };