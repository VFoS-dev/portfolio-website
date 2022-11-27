import React, { Component, Fragment } from 'react';

export class PlanetDestroyer extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Planet Destroyer</h1>
                    <h5>Dec 5, '20 - Apr 15, '21</h5>
                    <p>This project was made as the final project for GIMM 490. This project was started in GIMM 290.
                    </p>
                    <div style={{ width: 'calc(55.4vw)', height: 'calc(55.4vw * 0.5625)', backgroundColor: 'gray', color: 'white' }} >add video</div>
                    <br />
                    <h5>Made with: Unity, C#, Blender, <a href='https://github.com/VFoS-dev/Planet-Destroyer-V1.4' target='_blank'>Github</a></h5>
                </center>
            </Fragment>
        );
    }
}
