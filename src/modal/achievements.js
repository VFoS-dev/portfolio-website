import React, { Component, Fragment } from 'react';
import { achievementsData } from '../_data/AchievementData';
import { getAchievements, clearAchievements } from '../_reducers/achievements';
import { setCookie } from '../utils';
import { STORE_DUCK_HUNT } from '../_actions/storage';

export class AchievementModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            update: false,
        }

        this.keyHandle = this.keyHandle.bind(this);
        document.addEventListener('keydown', this.keyHandle);
    }

    componentWillUnmount = () => document.removeEventListener('keydown', this.keyHandle);

    keyHandle({ keyCode }) {
        if (keyCode != 27) return; // escape
        const { show } = this.state;
        this.setState({ show: !show })
    }

    handleAchievementStatus(achieved) {
        let res = [], ser = [];
        let sortedAchievements = Object.keys(achieved).sort((a, b) => achievementsData[a].name.localeCompare(achievementsData[b].name));

        for (const id of sortedAchievements) {
            let completed = achieved[id] instanceof Date;
            if (!completed && !achievementsData[id].visible) continue;
            let { name, description, data, fullDescription } = achievementsData[id];

            if (completed) {
                let date = achieved[id].toLocaleDateString('nu', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });

                res.push(<div key={`${id}-achievement`} className={`achieved completed`}>
                    <div>
                        <div className='name'>{name}</div>
                        <div>{description}</div>
                    </div>
                    <div>
                        <div className='howto'>{fullDescription}</div>
                        <div className='date'>{date}</div>
                    </div>
                </div>);
            } else {

                ser.push(<div key={`${id}-achievement`} className={`achieved inprogress`}>
                    <div>
                        <div className='name'>{name}</div>
                        <div>{description}</div>
                        <div className='gap'></div>
                        <div className='howto'>In Progress - {data.length - achieved[id].length}/{data.length}</div>
                    </div>
                </div>);
            }
        }

        return [ser, res].flat();
    }

    clear() {
        const { update } = this.state;
        clearAchievements();
        setCookie(STORE_DUCK_HUNT, 1, -1);
        this.setState({ update: !update });
    }

    render() {
        const { show } = this.state;
        if (!show) return <Fragment />
        const achieved = getAchievements()

        let completed = Object.keys(achieved).filter(a => achieved[a] instanceof Date).length;
        let total = Object.keys(achievementsData).length;
        return (
            <Fragment>
                <div className='achievement-modal'>
                    <div className='achieve-header'>
                        <div className='exit'>press ESC to close</div>
                        <div className='head'>Achievement Menu</div>
                        <div className='info'><div>{completed}/{total} achievements</div> <div>{(completed / total * 100).toFixed(2)}% completed</div></div>
                    </div>
                    <div className='achievement-list'>
                        {this.handleAchievementStatus(achieved)}
                    </div>
                    <div className='gap' />
                    <div className='footer-privacy'>
                        <div><strong>Privacy policy:</strong> information gathered is stored locally and no information is leaving your browser.</div>
                        <button onClick={() => this.clear()}>Clear all saved information</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}