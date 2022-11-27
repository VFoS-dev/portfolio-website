import React, { Component, Fragment } from 'react';

export class TheSimpleRing extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>The Simple Ring Alpha</h1>
                    <h5>Oct 8, '20 - Dec 24, '21</h5>
                    <p>This project was made for <a href='https://thesimplering.com' target="_blank">The Simple Ring</a> Company. I worked as an independant contractor
                        initially to develop a database to store custom rings created in an app, and allow them to be shareable by a url. This slowly evolved into website alternative from
                        the app. This project ended before it reached launch. Here is a link to the a demo.
                    </p>
                    <h5><a href='https://ringtesting.jonathankido.com' target="_blank">Website Demo</a> made with: Unity WebGL, C#, React, Javascript, Firebase</h5>
                </center>
            </Fragment>
        );
    }
}
