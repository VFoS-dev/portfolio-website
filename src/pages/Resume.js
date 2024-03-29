import React, { Fragment, createRef } from 'react';
import { connect } from 'react-redux';
import { EditableFocusRot, createKey, dragParentElement, onDoubleClick } from '../utils';

import '../css/resume.css'
import { resumeCombinedData, resumeData } from '../_data';
import { checkAchievement } from '../_actions/user.actions';

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
        if (flavored) this.props.checkAchievement('flavResume')
    }

    set(info, value = null) {
        const [id, index] = info.split('-');
        let { windows } = this.state;
        switch (id) {
            case 'closed':
                windows.splice(index, 1);
                this.props.checkAchievement('exitWindow')
                break;
            case 'focused':
                windows[index].minimized = false;
                windows = windows.map((w, i) => ({ ...w, focused: i == index }));
                break;
            case 'minimized':
                windows[index].focused = false;
            case 'fullscreened':
                this.props.checkAchievement('xplorer')
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

    createResume() {
        window.open('/resume?create=1', '_blank');
    }

    openResume(subset = 'complete') {
        this.props.checkAchievement('realresume');
        window.open(`/pdf/${subset}_resume_eye_friendly.pdf`, '_blank');
    }

    render() {
        const { windows, } = this.state;
        const { education } = resumeData;
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
                        <div className="title-bar" {...dragParentElement(false, false, this.props.checkAchievement, 'xplorer')}>
                            <div className="title-bar-text"><div className='wordIcon title' />Jon Kido Resume 20XX Rough Draft - Microsoft Word</div>
                            <div className="title-bar-controls">
                                <button aria-label="Minimize" id={`minimized-${i}`} onClick={(e) => this.set(e.target.id)}></button>
                                <button aria-label="Maximize" id={`fullscreened-${i}`} onClick={(e) => this.set(e.target.id)}></button>
                                <button aria-label="Close" id={`closed-${i}`} onClick={(e) => this.set(e.target.id)}></button>
                            </div>
                        </div>
                        <div className="window-options" />
                        <div className="window-body">
                            <div className='window-page' {...EditableFocusRot()} onKeyUp={() => this.props.checkAchievement('editResume')}>
                                <center><h1>Want a polished resume?</h1>
                                    <h5>
                                        <button className='hyperlink' onClick={() => this.openResume('complete')} >Complete Resume</button> <button className='hyperlink' onClick={() => this.openResume('gamedev')} >Game Dev Resume</button> <button className='hyperlink' onClick={() => this.openResume('full-stack')} >Full Stack Resume</button>
                                    </h5>
                                    <br />
                                    <br />
                                    <h1>Want to create a custom resume? </h1>
                                    <h5>
                                        <button className='hyperlink' onClick={() => this.createResume()} >Click Here</button>
                                    </h5>
                                </center>
                                <h2>Education: </h2>
                                {education.map(({ school, years, majors, minors }, i) => <p key={`${school}-${i}`} className='tab'>
                                    {school}: {years}
                                    <br />Major: {majors.map(({ short, long }, i) => <Fragment key={`${school}-${short}-${i}`}>{i > 0 ? ', ' : ""}<strong>{short}</strong> ({long})</Fragment>)}
                                    <br />Minors: {minors.map(({ short, long }, i) => <Fragment key={`${school}-${short}-${i}`}>{i > 0 ? ', ' : ""}<strong>{short}</strong> ({long})</Fragment>)}
                                </p>)}

                                <br />
                                {resumeCombinedData(flavored)}
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
                })}

                <div className='taskbar'>
                    <div className='start' onClick={() => this.props.checkAchievement('windowStart')}><div className='windowIcon' />start</div>
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

const actionCreators = {
    checkAchievement
};

const connectedResume = connect(mapState, actionCreators)(Resume);
export { connectedResume as Resume };
