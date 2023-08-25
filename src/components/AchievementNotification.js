import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/achievement.css';

class AchievementNotification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queue: [
                {
                    state: 'notify'
                },
            ],
            states: {
                notify: 'close',
                close: 'notify',
            }
        };
        this.changestate = this.changestate.bind(this);
        this.nextAnimation = this.nextAnimation.bind(this);
        document.addEventListener('keydown', this.changestate);
    }


    changestate() {
        const { queue } = this.state;
        this.setState({ queue: [...queue, { state: 'notify' }] })
    }

    nextAnimation({ target: { id }, animationName }) {
        let { queue } = this.state;
        if (id == 'final-text' && animationName == 'fadeInWait') {
            queue[0].state = 'close';
            return this.setState({ queue });
        }
        if (id = 'popup' && animationName == 'fadeOut') {
            queue.shift();
            return this.setState({ queue });
        }
    }

    render() {
        const { queue } = this.state;
        const { name, state, percent } = (queue[0] || {});
        console.log(queue);
        return <div id='achievement-window'>
            <div className='screen'>
                <div id='popup' className={`achievement ${state}`} onAnimationEnd={this.nextAnimation}>
                    <div className='logo-container'>
                        <div className='logo' />
                    </div>
                    <div className='content'>
                        <div class='first'>
                            testing achievement look
                        </div>
                        <div class='second'>
                            some more text
                        </div>
                        <div class='third' id='final-text'>
                            Press ESC to view Achievements
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

function mapState(state) {
    const { achievements } = state;
    return { achievements };
}

const actionCreators = {};

const ConnectedAchievementNotification = connect(mapState, actionCreators)(AchievementNotification);
export { ConnectedAchievementNotification as AchievementNotification };