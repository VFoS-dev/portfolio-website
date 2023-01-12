import React from 'react';
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
        return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    }

    changePage(nav) {
        const page = window.location.href.split('/').splice(-1)[0].split('?')[0] || "intro";
        if (nav !== page) {
            const _newPage = nav || "intro";
            window.history.pushState(`/${_newPage}`, 'Title', `/${_newPage}`);
            this.props.updatePage(page, _newPage);
        }
    }
    render() {
        return (
            <div className="resume" style={{ backgroundImage: 'url(/images/resume/windows_xp_background.jpg)' }}>
                <div className='navpadding' />

                <div className="window" style={{ margin: '0px 10vw', width: "80vw" }}>
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
                            <center><h1 style={{ fontSize: '2vw' }}>Want a polished resume? <a href='/pdf/resume_eye_friendly.pdf' target="_blank">Click Here</a></h1></center>
                            <h2>Education: </h2>
                            <p className='tab'>
                                Boise State University: 2017 - 2022
                                <br />Major: <strong>GIMM</strong> (Games, Interactive Media, and Mobile)
                                <br />Minors: <strong>MATH</strong> (Applied Mathematics), <strong>ITM</strong> (Information Technology Management)
                            </p>
                            <br />
                            <h2>Experience: </h2>
                            <p><strong>Software Engineer - Matraex Inc.</strong></p>
                            <p><em>January 2023 - Present</em></p>
                            <ul>
                                <li>Building Web and Mobile Apps</li>
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
