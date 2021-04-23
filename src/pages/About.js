import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';
import self from '../pictures/self.jpg';

class About extends React.Component {
    render() {
        return (<div className="about">
            <center>
                <img className='self' src={self} />
            </center>
            <div className='temp'>
                <p>Hello my name is Jon Kido</p>
                <p>was a peer mentor nicknamed 'The Wizard' because of my ability to debug almost everything thrown at me</p>
                <p>field of studies: <strong>GIMM</strong> (Games, Interactive Media, and Mobile), <strong>MATH</strong> (Applied Mathematics), <strong>ITM</strong> (Information Technology Management)</p>
            </div>
        </div>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedAbout = connect(mapState, actionCreators)(About);
export { connectedAbout as About };