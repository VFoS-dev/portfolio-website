import React, { createRef } from 'react';
import { connect } from 'react-redux';
import { EditableFocusRot, createKey, dragParentElement, onDoubleClick } from '../utils';

import '../css/resume.css'
import { resumeData } from '../_data';

class Resume extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            windows: [
                {
                    flavored: false,
                    focused: true,
                    minimized: false,
                    fullscreened: false,
                    key: createKey()
                }
            ]
        }

        this.timeEle = createRef();
        this.time = setInterval(() => this.updateTime(), 1000);

        this.newWindow = this.newWindow.bind(this);
        this.updateTime = this.updateTime.bind(this);
    }

    updateTime() {
        const { current: time } = this.timeEle
        if (time) time.textContent = this.getTime();
    }

    componentWillUnmount = () => clearInterval(this.time);

    newWindow(flavored = false) {
        let { windows } = this.state;
        let keys = []
        windows.forEach(w => {
            w.focused = false;
            keys.push(w.key);
        })
        windows.push({
            flavored,
            focused: true,
            minimized: false,
            fullscreened: false,
            key: createKey(keys)
        })
        this.setState({ windows });
    }

    set(info, value = null) {
        const [id, index] = info.split('-');
        let { windows } = this.state;
        switch (id) {
            case 'closed':
                windows.splice(index, 1);
                break;
            case 'focused':
                windows[index].minimized = false;
                windows = windows.map((w, i) => ({ ...w, focused: i == index }));
                break;
            case 'minimized':
                windows[index].focused = false;
            default:
                windows[index][id] = value === null ? !windows[index][id] : value;
                break;
        }

        this.setState({ windows });
    }

    getTime = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    changePage(nav) {
        const [_, page, secret] = window.location.pathname.split('/');
        if (nav !== page) {
            const _newPage = nav || "intro";
            window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);
            this.props.updatePage(page, _newPage);
        }
    }

    render() {
        const { windows, } = this.state;
        return (
            <div className="resume" style={{ backgroundImage: 'url(/images/resume/windows_xp_background.webp)' }}>
                <div className='navpadding' />
                <div className='center-start windows-icon-offset' >
                    <div className='start'>
                        <div className='windows-icon' style={{ position: 'relative' }} {...onDoubleClick(this.newWindow, [false])} {...dragParentElement(true, true)}>
                            <img src='/images/resume/wordicon_destop.svg' />
                            <p>Jon Kido Resume 20XX Rough Draft</p>
                        </div>
                    </div>
                    <div className='start'>
                        <div className='windows-icon' style={{ position: 'relative' }} {...onDoubleClick(this.newWindow, [true])} {...dragParentElement(true, true)}>
                            <img src='/images/resume/wordicon_destop.svg' />
                            <p>Flavored Resume 20XX Rough Draft</p>
                        </div>
                    </div>
                </div>
                {windows.map(({ minimized, fullscreened, focused, key, flavored }, i) => {
                    let state = `${focused ? ' focused' : ''}${fullscreened ? ' fullscreened' : ''}${minimized ? ' minimized' : ''}`
                    return <div key={`windows-${key}`} className={`window${state}`} onMouseDown={() => this.set(`focused-${i}`, true)}>
                        <div className="title-bar" {...dragParentElement()}>
                            <div className="title-bar-text"><div className='wordIcon title' />Jon Kido Resume 20XX Rough Draft - Microsoft Word</div>
                            <div className="title-bar-controls">
                                <button aria-label="Minimize" id={`minimized-${i}`} onClick={(e) => this.set(e.target.id)}></button>
                                <button aria-label="Maximize" id={`fullscreened-${i}`} onClick={(e) => this.set(e.target.id)}></button>
                                <button aria-label="Close" id={`closed-${i}`} onClick={(e) => this.set(e.target.id)}></button>
                            </div>
                        </div>
                        <div className="window-options" />
                        <div className="window-body">
                            <div className='window-page' {...EditableFocusRot()}>
                                <center><h1>Want a polished resume? <button className='hyperlink' onClick={() => window.open('/pdf/resume_eye_friendly.pdf', '_blank')} >Click Here</button></h1></center>
                                <h2>Education: </h2>
                                <p className='tab'>
                                    Boise State University: 2017 - 2022
                                    <br />Major: <strong>GIMM</strong> (Games, Interactive Media, and Mobile)
                                    <br />Minors: <strong>MATH</strong> (Applied Mathematics), <strong>ITM</strong> (Information Technology Management)
                                </p>
                                <br />
                                {resumeData(flavored)}
                                <br />
                                <h2>Projects:<button className='hyperlink' onClick={() => this.changePage('projects')} >Click Here</button></h2>
                                <br />
                                <h2>Skills:<button className='hyperlink' onClick={() => this.changePage('skills')} >Click Here</button></h2>
                                <br />
                                <h2>Contact Information:<button className='hyperlink' onClick={() => this.changePage('socials')} >Click Here</button></h2>
                                <p>Email: jonkido@vfos.dev</p>
                            </div>
                        </div>
                    </div>
                })
                }

                <div className='taskbar'>
                    <div className='start'><div className='windowIcon' />start</div>
                    <div className='applications'>
                        {windows.map(({ key, focused }, i) => <div key={key} className={`application${focused ? ' focused' : ''}`} onMouseDown={() => this.set(`focused-${i}`, true)}><div className='wordIcon' /><div className='txt'>Jon Kido Resume 20XX Rough Draft - Microsoft Word</div></div>)}
                    </div>
                    <div ref={this.timeEle} id="time">{this.getTime()}</div>
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
