import React, { Component, Fragment } from 'react';

export class OLogoAni extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Original Logo Animation</h1>
                    <h5>June 13, 2015</h5>
                    <p>This was a simple project in high school, and actually my first animation using blender, at the time I was thinking I would be a Youtuber and this would be my short intro before every video.</p>
                    <p>Meaning behind: <a href='/about#VFoS'>VFoS</a></p>
                    <video className='video' controls><source src="/images/projects/info/firstanimation.mp4" type="video/mp4" /></video>
                    <br />
                    <h5>Made with: Blender</h5>
                </center>
            </Fragment>
        );
    }
}
