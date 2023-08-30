import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createRef } from 'react';
import { checkAchievement } from '../_actions/user.actions';

import '../css/intro.css';
import { snakeGame } from '../canvas-games/snake';
import { timeout } from '../utils/game';
import { SendKeyCode } from '../utils/events';

class Intro extends React.Component {
    constructor(props) {
        super(props);
        const { activePage } = this.props;
        const { setup, gameStart, dismount, } = snakeGame(activePage, this.endGame, this.props.checkAchievement);
        this.state = {
            setup, gameStart, dismount,
            setupSnake: false,
            gameState: false,
        }

        this.canvas = createRef();

        this.endGame = this.endGame.bind(this);
    }

    componentWillUnmount = () => this.state.dismount();

    endGame = () => this.setState({ gameState: false });

    async linkSnake() {
        await timeout(0);
        this.state.setup(this.canvas.current);
        this.setState({ setupSnake: true });
    }

    toSnake() {
        this.state.gameStart();
        this.setState({ gameState: true });
    }

    toResume() {
        this.props.checkAchievement('realresume');
        window.open('/pdf/resume_eye_friendly.pdf', '_blank');
    }

    vKeyboard({ target: { id } }) {
        if (!id) return;
        SendKeyCode(id);
    }

    render() {
        const { setupSnake, gameState } = this.state;
        if (!setupSnake) this.linkSnake();

        return (
            <Fragment>
                <div className={`intro ${gameState ? 'game-active' : ''}`}>
                    <div className='sticky-underlay'>
                        <canvas id='snake' ref={this.canvas} />
                    </div>
                    <div className='light-top' />
                    <div className='light-bottom' />
                    <div className="welcome">
                        <h3 className='relative'>Hello <div className='wave'></div></h3>
                        <h1>I'm <span className='name'>Jon Kido</span></h1>
                        <h3 className='cred'>Full Stack and Game Developer</h3>
                        <div className='button-container'>
                            <button className='button orange' onClick={() => this.toSnake()}>Play Snake</button>
                            <button className='button grey' onClick={() => this.toResume()}>View Resume</button>
                        </div>
                    </div>
                    <div className='WASD' onClick={this.vKeyboard}>
                        <div>
                            <div className='key' id='87'>↑</div>
                        </div>
                        <div>
                            <div className='key' id='65'>←</div>
                            <div className='key' id='83'>↓</div>
                            <div className='key' id='68'>→</div>
                        </div>
                    </div>
                </div>
            </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {
    checkAchievement
};

const connectedIntro = connect(mapState, actionCreators)(Intro);
export { connectedIntro as Intro };