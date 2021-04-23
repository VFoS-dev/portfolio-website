import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Intro extends React.Component {
    render() {
        return (<div className="intro">
            <center>
                <h1>Welcome to my portfolio site!</h1>
                <p>this is a site that is getting content added weekly so comeback and see newer items</p>
            </center>
            <center className='demoSpacing'>
                <h2>Demo Reel</h2>
                <iframe className='demo' src="https://www.youtube.com/embed/9Si9y5Ik7HI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <p>this video is comprised of some of the projects of my years of college, in historical order. so it gets more advanced the later on in the video</p>
            </center>
        </div>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedIntro = connect(mapState, actionCreators)(Intro);
export { connectedIntro as Intro };