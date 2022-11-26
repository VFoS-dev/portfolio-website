import React, { Component, Fragment } from 'react';

export class Defend extends Component {
    render() {
        var { clientHeight } = document.documentElement
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Defend</h1>
                    <h5>Aug 3 - 18, 2018</h5>
                    <p>Defend was a side project I made towards the end of GIMM 260, and during my first year as a peer mentor. This project was made with the goal in mind of becoming another game template for Professor Ellertson to have available for the incoming freshman.</p>
                    <div style={{ background: 'grey', height: `${Math.floor(clientHeight * 0.6)}px`, width: `${Math.floor(clientHeight * 0.6 * 1.77778)}px`, textAlign: 'center', color: 'white' }}>add video</div>
                    <br />
                    <h5>Made with: Adobe Animate, ActionScript 3</h5>
                    <br />
                    <hr />
                    <h1>Playable Flash game</h1>
                    <br />
                        <object height={`${Math.floor(clientHeight * 0.6)}px`} width={`${Math.floor(clientHeight * 0.6 * 1.77778)}px`} type="application/x-shockwave-flash" data="/flash/Defend.swf" />
                    <p>This project is a Flash game. If you want to play it for yourself, you will have to use a supporting brower like <a href='https://www.palemoon.org' target="_blank">Pale Moon</a>.</p>
                </center>
            </Fragment>
        );
    }
}
