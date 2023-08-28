import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/intro.css';
import { createRef } from 'react';

class Intro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

        this.canvas = createRef()
    }

    render() {
        return (
            <Fragment>
                <div className="intro">
                    <div className='sticky-underlay'>
                        <canvas id='snake' ref={this.canvas} />
                    </div>
                    <div className='light-top' />
                    <div className='light-bottom' />
                    <div className="welcome">
                        <h3 className='relative'>Hello <div className='wave'></div></h3>
                        <h1>I'm <span className='name'>Jon Kido</span></h1>
                        <h3 className='cred'>Full Stack and Game Developer</h3>
                    </div>
                </div>
            </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedIntro = connect(mapState, actionCreators)(Intro);
export { connectedIntro as Intro };