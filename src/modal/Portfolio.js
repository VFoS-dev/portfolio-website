import React, { Component, Fragment } from 'react';

export class Portfolio extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px" }}>
                    <h1>Portfolio Website</h1>
                    <h5>Oct 26, '22 - Present</h5>
                    <p> This project is my portfolio and you are currently viewing my portfolio, and you can view my portfolio within my portfolio as well as view my portfolio within...</p>
                    <iframe src="/" title='portfolio' style={{ width: 'calc(80vw)', height: 'calc(80vw * 0.5625)' }}></iframe>
                    <br />
                    <h5><a href='/projects/portfolio_website' target="_blank">Website</a> made with: React, Javascript, Blender, Krita</h5>
                </center>
            </Fragment>
        );
    }
}
