import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/resume.css'

class Resume extends React.Component {
    constructor(props) {
        super(props)
        this.time = setInterval(
            () => {
                const t = document.getElementById('time')
                if (t) t.innerHTML = this.getTime()
            }, 1000
        )
    }

    componentWillUnmount() {
        clearInterval(this.time)
    }

    getTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    render() {
        return (
            <div className="resume" style={{backgroundImage:'url(/images/resume/windows_xp_background.jpg)'}}>
                <div className='navpadding' />

                <div className="window" style={{ margin: '0px 15vw', width: "70vw" }}>
                    <div className="title-bar">
                        <div className="title-bar-text"><div className='wordIcon title' />Jon Kido Resume 20XX Rough Draft - Microsoft Word</div>
                        <div className="title-bar-controls">
                            <button aria-label="Minimize"></button>
                            <button aria-label="Maximize"></button>
                            <button aria-label="Close"></button>
                        </div>
                    </div>
                    <div className="window-options" />
                    <div className="window-body">
                        <div className='window-page'>
                            <center><h3>Want a polished resume? <a href='/pdf/resume.pdf' target="_blank">Click Here</a></h3></center>
                            <br />
                            <h6>content added soon</h6>
                        </div>
                    </div>
                    <hr />
                </div>

                <div className='taskbar'>
                    <div className='start'><div className='windowIcon' />start</div>
                    <div className='application'><div className='wordIcon' /><div className='txt'>Jon Kido Resume 20XX Rough Draft - Microsoft Word</div></div>
                    <div id="time">{this.getTime()}</div>
                </div>
            </div >
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedResume = connect(mapState, actionCreators)(Resume);
export { connectedResume as Resume };