import React, { Component, Fragment } from 'react';

export class ABCStories extends Component {
    render() {
        var { clientWidth } = document.documentElement
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>ABC Stories</h1>
                    <h5>Apr 12 - Dec 23, 2020</h5>
                    <p>This project was the first project that I got put on after getting hired by GIMM Works. The team was creating an app to help students who were struggling with writing. My job was to create a website that would display statistics about the users' progress to help them and their teachers figure out what they should focus on to improve. This project was later given to Blocksmith to maintain the server and app.<br />however in the future the website functionality may be moved to the app.</p>
                    <h5>Video of the App</h5>
                    <iframe width="100%" height={`${clientWidth * 0.554 * 0.5625}px`} src="https://www.youtube.com/embed/f6TUAltSobQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <br />
                    <h5><a href='https://apps.apple.com/us/app/abc-stories/id1539194514' target='_blank'>Application</a> made with: Swift, SQLite</h5>
                    <br />
                    <br />
                    <h5>Video of the Website</h5>
                    <div style={{ width: 'calc(55.4vw)', height: 'calc(55.4vw * 0.5625)', backgroundColor: 'gray', color: 'white' }} >add video</div>
                    <br />
                    <h5><a href='https://www.abcstories.org/about' target='_blank'>Website</a> made with: React, Javascript, Express.js, MongoDB</h5>
                </center>
            </Fragment>
        );
    }
}
