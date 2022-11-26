import React, { Component, Fragment } from 'react';

export class Survive extends Component {
    render() {
        var { clientHeight } = document.documentElement
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Survive</h1>
                    <h5>Sep 18 - Oct 31, 2017</h5>
                    <p>Survive was the first individual game I created in GIMM 110 and my first game ever. The assignment was to create a game based off of a very basic template.
                        The template I based mine on was a space shooter with the player's ship locked in the center of the screen.</p>
                    <p>I changed the ship from being stagnant to be able to move with player input subject to gravity, added the ability to change weapon types (one a charged attack and the other a fully automatic attack with reload) by pressing w, and created my own graphics.</p>
                    <div style={{ background: 'grey', height: `${Math.floor(clientHeight * 0.6)}px`, width: `${Math.floor(clientHeight * 0.6 * 1.77778)}px`, textAlign: 'center', color: 'white' }}>add video</div>
                    <br />
                    <h5>Made with: Adobe Animate, ActionScript 3</h5>
                    <br />
                    <hr />
                    <h1>Playable Flash game</h1>
                    <br />
                    <object height={`${Math.floor(clientHeight * 0.6)}px`} width={`${Math.floor(clientHeight * 0.6 * 1.77778)}px`} type="application/x-shockwave-flash" data="/flash/Survive.swf" />
                    <p>This project is a Flash game. If you want to play it for yourself, you will have to use a supporting brower like <a href='https://www.palemoon.org' target="_blank">Pale Moon</a>.</p>
                </center>
            </Fragment>
        );
    }
}
