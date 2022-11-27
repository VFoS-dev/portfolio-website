import React, { Component, Fragment } from 'react';

export class SwordWhip extends Component {
    render() {
        var { clientHeight } = document.documentElement
        return (
            <Fragment>
                <center style={{ position: 'relative', margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>SwordWhip</h1>
                    <h5>Sep 15 - 16, 2020</h5>
                    <p>This project was created during the first few days of <a href='/projects/cash_n_slash'>Cash n' Slash</a>. Orignially the project was going to have weapons but later it was changed so that the player had to grab the cash and there would be no weapons in the game at all after that point. I later used this in a school project.</p>
                    <p>This was my take on a weapon. It was inspired by Soul Calibur character Ivy's weapon. This project was made using Unity's Hinge Joint component, with a script attached so that the length could increase and decrease. While the length was decreasing it would also reduce the hinges' swing distance so it would not move while it was fully retracted.</p>
                    <div style={{ background: 'grey', height: `${Math.floor(clientHeight * 0.6)}px`, width: `${Math.floor(clientHeight * 0.6 * 1.77778)}px`, textAlign: 'center', color: 'white' }}>add video</div>
                    <br />
                    <h5>Made with: Unity, C#, Blender</h5>
                    <br />
                    <hr />
                    <h1>Other Images</h1>
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <img src='/images/projects/info/swordwhip1.png' />
                        <img src='/images/projects/info/swordwhip2.png' />
                    </div>
                </center>
            </Fragment>
        );
    }
}
