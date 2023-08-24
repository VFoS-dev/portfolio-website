import React, { Fragment, createRef } from 'react';
import { connect } from 'react-redux';
import { timeout } from '../utils';
import { socialsData, social_Data } from '../_data';
import { fruitNinja } from '../canvas-games';

import '../css/socials.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        const { activePage } = this.props;
        const { setup, dismount, gameStart } = fruitNinja(activePage);

        this.state = {
            started: false,
            toGame: false,
            setup,
            gameStart,
            dismount,
        }

        this.canvas = createRef()
    }

    componentWillUnmount = () => this.state.dismount();
    gameStart = () => this.state.gameStart();

    async setup() {
        await timeout(0);
        this.setState({ started: true });
        this.state.setup(this.canvas.current);
    }

    openLink(index) {
        const { href } = social_Data[index];
        switch (href) {
            case 'game-start': return this.setState({ toGame: true });
            default: return window.open(href, '_blank');
        }
    }

    render() {
        const { started, toGame } = this.state;
        const { activePage } = this.props;

        if (activePage && !started) this.setup();

        return (<Fragment>
            <canvas id='slash' className='sticky-overlay' ref={this.canvas} />
            <div className="socials">
                <div className='navpadding' />
                <div className={`links ${toGame ? ' toGame' : ''}`} onAnimationEnd={() => this.gameStart()}>
                    {socialsData([]).map(({ name, gif, ring, shadow, upper, lower }, index) => (
                        <div key={`option-${name}`} className='option' style={{ backgroundImage: `url(${shadow})` }}>
                            <div className='option-group'>
                                <div className='circle'>
                                    <svg className='text' viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
                                        <path id="upper" fill="none" transform="translate(19.7999976778584, 84) scale(1,-1)"
                                            d="M0 -1.26218e-29C-3.33663e-14 22.9365 12.2365 44.1306 32.1 55.5988C51.9636 67.0671 76.4365 67.0671 96.3 55.5988C116.164 44.1306 128.4 22.9365 128.4 1.09118e-13" />
                                        <path id="lower" fill="none"
                                            transform="matrix(-0.999980871067792 0.00618381781983816 -0.00618381781983816 -0.999980871067792 148.19877424465 83.6029988816068)  scale(1,-1)"
                                            d="M0 1.77501e-13C1.05879e-13 35.4567 28.7433 64.2 64.2 64.2C99.6567 64.2 128.4 35.4567 128.4 2.29597e-13" />
                                        <text className="fnFont" alignmentBaseline="top">
                                            <textPath href="#upper" {...upper}>{name}</textPath>
                                            <textPath href="#lower" {...lower}>{name}</textPath>
                                        </text>
                                    </svg>
                                    <img className='decor' src={ring} />
                                </div>
                                <img className='gif' src={gif} id={index} onClick={(e) => this.openLink(e.target.id)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedSocials = connect(mapState, actionCreators)(Socials);
export { connectedSocials as Socials };