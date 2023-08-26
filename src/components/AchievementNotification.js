import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { checkAchievement, removeAchievementQueue, updateAchievementQueue } from '../_actions/user.actions';

import '../css/achievement.css';

class AchievementNotification extends Component {
    constructor(props) {
        super(props);
        this.nextAnimation = this.nextAnimation.bind(this);
    }

    nextAnimation({ target: { id }, animationName }) {
        if (!id || !animationName) return;
        const { achieveSetState, achieveFinish } = this.props;

        if (id == 'final-text' && animationName == 'fadeInWait')
            achieveSetState('close');

        if (id = 'popup' && animationName == 'fadeOut')
            achieveFinish();
    }

    achievementType(percent) {
        let p;
        if (percent) {
            p = parseInt(percent);
            if (percent < 15) return `Rare achievement unlocked - ${p.toFixed(0)}%`;
            if (p < 10) p = p.toFixed(1);
        }
        return `Achievement unlocked${p ? ` - ${p}%` : ''}`
    }

    render() {
        const { queue: [{ name, aniState, percent: p, description, achievementName } = {}] } = this.props.achievements;
        const achievement = this.achievementType(p);

        this.props.checkAchievement('completed', achievementName)

        return <div id='achievement-window'>
            <div className='screen'>
                <div id='popup' className={`achievement ${aniState}`} onAnimationEnd={this.nextAnimation}>
                    <div className='logo-container'>
                        <div className='logo' />
                    </div>
                    <div className='content'>
                        <div className='first'>
                            {achievement}<br />
                            {name || 'Unamed Achievement'}
                        </div>
                        {description && <div className='second'>
                            {description}
                        </div>}
                        <div className={description ? 'third' : 'second'} id='final-text'>
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

const actionCreators = {
    achieveSetState: updateAchievementQueue,
    achieveFinish: removeAchievementQueue,
    checkAchievement
};

const ConnectedAchievementNotification = connect(mapState, actionCreators)(AchievementNotification);
export { ConnectedAchievementNotification as AchievementNotification };