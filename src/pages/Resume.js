import React, { } from 'react';
import { connect } from 'react-redux';
import { EditableFocusRot, createKey, dragParentElement, onDoubleClick } from '../utils';

import '../css/resume.css'

class Resume extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            windows: [
                {
                    focused: true,
                    minimized: false,
                    fullscreened: false,
                    key: createKey()
                }
            ]
        }

        this.time = setInterval(
            () => {
                const t = document.getElementById('time');
                if (t) t.textContent = this.getTime();
            }, 1000
        );

        this.newWindow = this.newWindow.bind(this);
    }

    componentWillUnmount = () => clearInterval(this.time);

    newWindow() {
        let { windows } = this.state;
        let keys = []
        windows.forEach(w => {
            w.focused = false;
            keys.push(w.key);
        })
        windows.push({
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
            <div className="resume" style={{ backgroundImage: 'url(/images/resume/windows_xp_background.jpg)' }}>
                <div className='navpadding' />
                <div className='windows-icon center-start' {...onDoubleClick(this.newWindow)} {...dragParentElement(true)}>
                    <img src='/images/resume/wordicon_destop.svg'/>
                    <p>Jon Kido Resume 20XX Rough Draft</p>
                </div>
                {windows.map(({ minimized, fullscreened, focused, key, }, i) => {
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
                                <h2>Experience: </h2>
                                <p><strong>Software Engineer - Matraex Inc.</strong></p>
                                <p><em>January 2023 - August 2023</em></p>
                                <ul>
                                    <li>Did full stack development on multiple web/app projects for clients</li>
                                    <li>Create scripts that automate tasks, making development faster and smoother</li>
                                    <li>Worked with the team to improve processes and increase documentation standards</li>
                                    <li>Made flexible tools and reusable features that are used across several projects</li>
                                    <li>Optimized several pages, functions, and API calls</li>
                                </ul>
                                <p><strong>Software Developer - GIMM Works</strong></p>
                                <p><em>January 2020 - January 2023</em></p>
                                <ul>
                                    <li>Worked with other student developers on unique software projects for clients</li>
                                    <li>Led back-end dev on several projects</li>
                                    <li>Did full stack development and 3D modeling for multiple projects</li>
                                    <li>Helped other teams implement security features on their projects</li>
                                    <li>Mentored two new hires to help them learn React</li>
                                </ul>
                                <p><strong>Independent Contractor, App Development - The Simple Ring</strong></p>
                                <p><em>September 2020 - December 2021</em></p>
                                <ul>
                                    <li>Worked for the founders of The Simple Ring on a consumer-based mobile app</li>
                                    <li>Wrote the back-end data storage structure, designed and implemented the front-end UI, and integrated Firebase into the app</li>
                                    <li>Prompted improvements in code quality and structure that affected both the front-end and the back-end</li>
                                </ul>
                                <p><strong>GIMM Senior Peer Mentor - Boise State GIMM Program</strong></p>
                                <p><em>July 2018 - December 2019</em></p>
                                <ul>
                                    <li>Helped current GIMM students with debugging and gave advice about their code</li>
                                    <li>Assisted other peer mentors when they got stuck</li>
                                    <li>Presented previous projects of the department to prospective students and clients</li>
                                    <li>Managed checking out equipment to other students</li>
                                </ul>
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
                    <div className='start'><div className='windowIcon' />start</div>
                    <div className='applications'>
                        {windows.map(({ key, focused }, i) => <div key={key} className={`application${focused ? ' focused' : ''}`} onMouseDown={() => this.set(`focused-${i}`, true)}><div className='wordIcon' /><div className='txt'>Jon Kido Resume 20XX Rough Draft - Microsoft Word</div></div>)}
                    </div>
                    <div id="time">{this.getTime()}</div>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedResume = connect(mapState, actionCreators)(Resume);
export { connectedResume as Resume };
