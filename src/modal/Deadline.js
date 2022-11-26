import React, { Component, Fragment } from 'react';

export class Deadline extends Component {
    render() {
        var { clientHeight } = document.documentElement
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Deadline</h1>
                    <h5>Sept 6 - 13, 2018</h5>
                    <p>Deadline was a project I made during a challenge for Dev Club. The challenge was to make a game where the player had to compete a task before a countdown timer was up. These challenges were open for a week, with the results displayed to the rest of the club at the end of the week.</p>
                    <div style={{ background: 'grey', height: `${Math.floor(clientHeight * 0.6)}px`, width: `${Math.floor(clientHeight * 0.6 * 1.77778)}px`, textAlign: 'center', color: 'white' }}>add video</div>
                    <br />
                    <h5>Made with: Adobe Animate, ActionScript 3</h5>
                    <br />
                    <hr />
                    <h1>Playable Flash game</h1>
                    <br />
                    <object height={`${Math.floor(clientHeight * 0.6)}px`} width={`${Math.floor(clientHeight * 0.6 * 1.77778)}px`} type="application/x-shockwave-flash" data="/flash/DeadlineGame.swf" />
                    <p>This project is a Flash game. If you want to play it for yourself, you will have to use a supporting brower like <a href='https://www.palemoon.org' target="_blank">Pale Moon</a>.</p>
                </center>
            </Fragment>
        );
    }
}
