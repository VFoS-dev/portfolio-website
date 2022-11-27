import React, { Component, Fragment } from 'react';

export class Uno extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Uno AI</h1>
                    <h5>Nov 21 - Dec 10, 2017</h5>
                    <p>Uno AI was a side project that I created towards the end of GIMM 110. The AI is coded to sort its hand in view, create an array of available options and then choose a random card to play or draw one if no plays are possible. </p>
                    <div className="video" >add video</div>
                    <br />
                    <h5>Made with: Adobe Animate, ActionScript 3</h5>
                    <br />
                    <hr />
                    <h1>Playable Flash game</h1>
                    <br />
                    <div className="video">
                        <object height="100%" width="100%" type="application/x-shockwave-flash" data="/flash/Uno.swf" aria-label="flash game"/>
                    </div>
                    <p>This project is a Flash game. If you want to play it for yourself, you will have to use a supporting brower like <a href='https://www.palemoon.org' rel="noreferrer" target="_blank">Pale Moon</a>.</p>
                </center>
            </Fragment>
        );
    }
}
