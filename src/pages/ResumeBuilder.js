import React, { Fragment, Component } from 'react';
import { projectData, resumeData, skillData } from '../_data';
import '../css/builder.css';

export class ResumeBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bodyState: '',
            skills: {
                coding: [],
                software: {},
                hidden: [],
                advanced: 85,
                intermediate: 60,
                beginner: 30,
                novice: 0,
            },
            colors: ['--OffRed', '--OffOrange', '--OffYellow', '--OffGreen', '--OffBlue', '--OffPurple',],
            pageOutline: 0,
        }

        this.populateSkills()

        document.getElementById('loading')?.remove();
        document.getElementById('root').classList = '';
        document.title = `Jon Kido - Resume ${new Date().getFullYear()}`;
        document.body.className = 'builder'
    }

    populateSkills() {
        let coding = [], software = {};
        const { skills, skills: { advanced, intermediate, beginner, } } = this.state;
        let levels = { beginner, intermediate, advanced };

        skillData.forEach(({ color, name, set }) => {
            set.forEach(({ name: sName, compentence, category }) => {
                const level = Object.keys(levels).reduce((a, b) => (skills[b] >= compentence && skills[b] > skills[a]) ? a : b, 'novice');
                if (category == 'software') {
                    if (!software[name]) software[name] = { set: [], name, color }
                    const { set } = software[name];
                    software[name].set = [...set, { name: sName, level }]
                } else coding.push({ name: sName, level })
            })
        })

        for (const data in software)
            if (!software[data].set.length)
                delete software[data];

        setTimeout(() => this.setState({
            skills: {
                ...skills,
                coding: coding.sort(({ name }, { name: bname }) => name.localeCompare(bname)),
                software
            }
        }), 0)
    }

    togglePrintFriendly = () => this.setState({ bodyState: document.body.id = document.body.id === 'printer' ? '' : 'printer' });

    render() {
        const { education } = resumeData;
        const { bodyState, pageOutline, skills: { coding, software }, colors } = this.state;

        return (<Fragment>
            <div className='no-print sticky-overlay'>
                <div className='left'>
                    <label>Page Outline: <input type='number' onChange={(e) => this.setState({ pageOutline: parseInt(e.target.value) })} min={0} step={1} defaultValue={0} /></label>
                </div>
                <div className='right'>
                    <button onClick={() => this.togglePrintFriendly()}>Toggle Modes</button>
                    <button onClick={() => window.print()}>Save Copy</button>
                </div>
            </div>
            {!!pageOutline && <div className='no-print fixed-overlay'>
                {[...new Array(pageOutline)].map((p, i) => <div key={`outline-${i}`} className='page-outline' />)}
            </div>}
            <div className='resume'>
                <header>
                    <div className="header-container">
                        <div className="logo"></div>
                        <div className="title">
                            <h1>Jonathan Kido</h1>
                            <h4 >Full Stack, Game Dev, Programmer</h4>
                        </div>
                    </div>
                    <div className="links">
                        <h5><a href="mailto:jonkido@vfos.dev" onKeyUp={(e) => console.log(e.target)}>jonkido@vfos.dev
                            <div className="icon">
                                <svg strokeWidth="0" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z">
                                    </path>
                                </svg>
                            </div>
                        </a>
                        </h5>
                        <h5><a href="https://vfos.dev" target="_blank" rel="noreferrer">vfos.dev
                            <div className="icon">
                                <svg strokeWidth="0" viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M1025.02 512c0-272.016-213.663-495.104-482.319-511.023-5.536-.608-11.088-1.009-16.72-1.009-1.664 0-3.328.176-4.992.224-2.992-.048-5.968-.224-8.992-.224C229.117-.032-1.026 229.664-1.026 512s230.144 512.032 513.023 512.032c3.024 0 6-.176 9.008-.24 1.664.064 3.328.24 4.992.24 5.632 0 11.184-.4 16.72-1.009 268.64-15.92 482.304-238.976 482.303-511.023zm-95.451 164.832c-17.632-5.12-61.92-16.24-140.064-25.392 6.464-44.192 10-90.896 10-139.44 0-38.256-2.208-75.343-6.288-111.008 99.008-11.824 142.384-26.72 145.296-27.745l-11.92-33.584c22.24 53.088 34.56 111.296 34.56 172.336 0 58.193-11.28 113.761-31.583 164.833zM285.488 512.001c0-35.808 2.37-70.77 6.705-104.401 51.888 4.08 113.936 7.088 186.863 7.792v222.064c-70.992.688-131.664 3.568-182.688 7.473-7.04-42.193-10.88-86.88-10.88-132.928zM542.945 68.223c78.464 22.736 145.648 131.695 175.744 276.111-48.368 3.856-106.624 6.673-175.744 7.33V68.223zm-63.886.783V351.63c-68.368-.688-126.88-3.473-176.063-7.232C333.7 201.79 401.428 93.646 479.059 69.006zm0 632.223l.001 253.743c-72.4-22.976-136.192-118.575-169.36-247.023 47.76-3.504 104.096-6.063 169.359-6.72zm63.888 254.543l-.001-254.56c65.952.623 122.064 3.28 169.217 6.928-32.608 130.128-96 226.416-169.216 247.632zm-.001-318.32l.001-222.032c73.311-.688 134.991-3.776 186.191-8a844.922 844.922 0 0 1 6.496 104.592c0 46.128-3.712 90.864-10.528 133.12-50.416-4.08-110.8-7.008-182.16-7.68zm371.858-323.52c-9.664 3.008-50.063 14.48-131.023 24.032-18.048-95.952-50.672-177.968-93.12-237.168C788.197 143.18 867.797 219.1 914.805 313.932zM358.82 90.589c-52.208 59.952-94.832 146.161-118.096 248.113-72.48-7.856-115.921-17.089-133.312-21.281 50.72-104.64 141.04-186.752 251.408-226.832zM83.637 377.182c12.32 3.344 58.913 14.941 145.553 24.525a795.86 795.86 0 0 0-7.68 110.305c0 48.273 4.368 94.721 12.24 138.688-74.4 8.033-120.16 17.649-140.688 22.609-19.44-50.096-30.208-104.447-30.208-161.312 0-46.96 7.312-92.256 20.783-134.815zm37.457 355.166c23.264-4.944 64.912-12.464 126.592-18.928 24.288 89.712 63.792 165.616 111.136 219.968-101.12-36.72-185.296-108.752-237.728-201.04zM690.662 923.18c38.224-53.264 68.48-125.024 87.296-208.801 63.408 7.28 103.216 15.792 123.296 20.864-48.016 83.072-121.855 149.393-210.592 187.937z">
                                    </path>
                                </svg>
                            </div>
                        </a>
                        </h5>
                    </div>
                </header>
                <div id="alt">
                    {bodyState ?
                        <h1>Eye-friendly version: <a href="https://vfos.dev/pdf/resume_eye_friendly.pdf">https://vfos.dev/pdf/resume_eye_friendly.pdf</a></h1> :
                        <h1>Print-friendly version: <a href="https://vfos.dev/pdf/resume_print_friendly.pdf">https://vfos.dev/pdf/resume_print_friendly.pdf</a></h1>
                    }
                </div>
                <main>
                    <div className="header gear">
                        <div className="cut-outs"><div /><div /><div /><div /></div>
                        <h1>Skills</h1>
                    </div>
                    <div className="skills-container">
                        <div className="info">
                            <div className="info-container">
                                <h1 className="title coding">Coding</h1>
                                <div className="content row" style={{ '--color': 'var(--lightBlue)', '--visual-color': 'var(--OffWhite)' }}>
                                    {coding.map(({ name, level }, i) => <div key={`${name}-${i}`} className={level}>{name}</div>)}
                                </div>
                            </div>

                            <div className="info-container">
                                <h1 className="title software">Software</h1>
                                <div className="content row" style={{ '--visual-color': 'var(--OffWhite)' }}>
                                    {Object.keys(software).map((s, i) => {
                                        const { set = [], name } = software[s]
                                        return <div className="container" style={{ '--color': `var(${colors[i % colors.length]})` }}>
                                            {set.map(({ name, level }, i) => <div key={`${name}-${i}`} className={level}>{name}</div>)}
                                            <div className="category">
                                                {name}
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className='legend-side'>
                            <div className="legend content" style={{ '--visual-color': 'var(--background)' }}>
                                <div className="advanced">Advanced</div>
                                <div className="intermediate">Intermediate</div>
                                <div className="beginner">Beginner</div>
                                <div className="novice">Novice</div>
                            </div>

                            <h1 className="more-info">
                                Want to learn more? <br />
                                Visit my portfolio: <a href="https://vfos.dev/">https://vfos.dev/</a>
                            </h1>
                        </div>
                    </div>

                    <div className="header checklist">
                        <div className="cut-outs"><div /><div /><div /><div /></div>
                        <h1>Experience</h1>
                    </div>

                    <div className="info-container full">
                        <h1 className="title building">Professional Experience</h1>
                        <div className="content block">
                            <section className="present">
                                <header>
                                    <h2>Software Developer - GIMM Works</h2>
                                    <em>January 2020 - January 2023</em>
                                </header>
                                <ul>
                                    <li>Worked with other student developers on unique software projects for clients</li>
                                    <li>Led back-end dev on several projects</li>
                                    <li>Did full stack development and 3D modeling for multiple projects</li>
                                    <li>Helped other teams implement security features on their projects</li>
                                    <li>Mentored two new hires to help them learn React</li>
                                </ul>
                            </section>
                            <section>
                                <header>
                                    <h2>Independent Contractor, App Development - The Simple Ring</h2>
                                    <em>September 2020 - December 2021</em>
                                </header>
                                <ul>
                                    <li>Worked for the founders of The Simple Ring on a consumer-based mobile app</li>
                                    <li>Wrote the back-end data storage structure, designed and implemented the front-end UI, and
                                        integrated Firebase into the app</li>
                                    <li>Prompted improvements in code quality and structure that affected both the front-end and the
                                        back-end</li>
                                </ul>
                            </section>
                            <section>
                                <header>
                                    <h2>GIMM Senior Peer Mentor - Boise State GIMM Program</h2>
                                    <em>July 2018 - December 2019</em>
                                </header>
                                <ul>
                                    <li>Helped current GIMM students with debugging and gave advice about their code</li>
                                    <li>Assisted other peer mentors when they got stuck</li>
                                    <li>Presented previous projects of the department to prospective students and clients</li>
                                    <li>Managed checking out equipment to other students</li>
                                </ul>
                            </section>
                        </div>
                    </div>

                    <div className="info-container full">
                        <div className="title">
                            <h1>GIMM Works Projects (Full Stack Projects)</h1>
                            <div className="icon">
                                <svg strokeWidth="0" viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m14.12 10.163 1.715.858c.22.11.22.424 0 .534L8.267 15.34a.598.598 0 0 1-.534 0L.165 11.555a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.66zM7.733.063a.598.598 0 0 1 .534 0l7.568 3.784a.3.3 0 0 1 0 .535L8.267 8.165a.598.598 0 0 1-.534 0L.165 4.382a.299.299 0 0 1 0-.535L7.733.063z">
                                    </path>
                                    <path
                                        d="m14.12 6.576 1.715.858c.22.11.22.424 0 .534l-7.568 3.784a.598.598 0 0 1-.534 0L.165 7.968a.299.299 0 0 1 0-.534l1.716-.858 5.317 2.659c.505.252 1.1.252 1.604 0l5.317-2.659z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div className="content block">

                            <section>
                                <header>
                                    <h2>MotorPool Services, proficiency testing website for BSU's Transportation Department</h2>
                                    <em>August 2022 - Present</em>
                                </header>
                                <ul>
                                    <li>Created the test functionality</li>
                                    <li>Added the ability for users to create dynamic quizzes</li>
                                    <li>Implemented UI/UX designs from team members</li>
                                    <li>Added PDF creation and signing</li>
                                    <li>Implemented password recovery via the server sending automated emails</li>
                                </ul>
                            </section>

                            <section>
                                <header>
                                    <h2>Bronco BEAM (Now BEAM Tours), campus tour app and web admin portal (<a href="https://broncobeam.com"
                                        target="_blank">https://broncobeam.com</a>)</h2>
                                    <em>December 2020 - July 2022</em>
                                </header>
                                <ul>
                                    <li>Refactored existing Node.js server to be more scalable and secure</li>
                                    <li>Created web admin portal using Google Maps API to allow universities to create and
                                        manage
                                        custom
                                        campus tours</li>
                                    <li>Wrote a tour pathfinding algorithm for the mobile app based on the user's available time
                                        for
                                        a tour</li>
                                    <li>Converted functional React Native app to a class-based implementation with Expo</li>
                                    <li>In the <a href="https://apps.apple.com/us/app/beam-tours/id1588971126"
                                        target="_blank">App
                                        Store</a> & <a href="https://play.google.com/store/apps/details?id=com.broncobeam_mobile&hl=en_US&gl=US"
                                            target="_blank">Play Store</a> </li>
                                </ul>
                            </section>

                            <section>
                                <header>
                                    <h2>All in Favor, educational voting game (<a href="https://allinfavor.org"
                                        target="_blank">https://allinfavor.org</a>)</h2>
                                    <em>September 2021 - January 2022</em>
                                </header>
                                <ul>
                                    <li>Wrote a custom networking system for the game in Node.js using Socket.IO, including the
                                        ability to
                                        reconnect to current games</li>
                                    <li>Minimized the amount of information bouncing from client to server to improve
                                        performance
                                    </li>
                                    <li>Worked with front-end developers to help them patch up security </li>
                                </ul>
                            </section>
                            <section>
                                <header>
                                    <h2>ABC Stories, educational iOS app and web portal (<a href="https://abcstories.org"
                                        target="_blank">https://abcstories.org</a>)</h2>
                                    <em>January 2019 - November 2020</em>
                                </header>
                                <ul>
                                    <li>Created an API for the website and app</li>
                                    <li>Wrote algorithms to compute statistics about users' performance within the app</li>
                                    <li>Secured data using bcrypt and jwt tokens</li>
                                    <li>Designed an account hierarchy so that accounts can manage and view accounts under them
                                    </li>
                                    <li>Linked the server with a SMTP server to help with account management through email</li>
                                    <li>Reformatted and styled the front-end of the website with React</li>
                                    <li>In the <a href="https://apps.apple.com/us/app/abc-stories/id1539194514"
                                        target="_blank">App
                                        Store</a></li>
                                </ul>
                            </section>
                        </div>
                    </div>

                    <div className="info-container full">
                        <div className="title">
                            <h1>Personal Projects</h1>
                            <div className="icon">
                                <svg strokeWidth="0" viewBox="0 0 496 512"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9 14.3 0 28-2.7 40.9-6.9 2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div className="content block">
                            <section className="present">
                                <header>
                                    <h2>Portfolio Website (Work In Progress: <a href="https://vfos.dev"
                                        target="_blank">https://vfos.dev</a>)</h2>
                                    <em>October 2022 - Present</em>
                                </header>
                                <ul>
                                    <li>Created custom navigation that parses the url to 'rotate' to the selected page</li>
                                    <li>Simulated a CSS cube. To save RAM & CPU usage, pages aren't rendered in the HTML if they aren't being used</li>
                                    <li>I created all minigames in JavaScript, although I am not the original creator of the game concepts</li>
                                </ul>
                            </section>
                            <section>
                                <header>
                                    <h2>Planet Destroyer, VR RTS game</h2>
                                    <em>December 2020 - May 2021</em>
                                </header>
                                <ul>
                                    <li>Individual project with all original code and art that was made with the Unity game engine</li>
                                    <li>Iterated multiple times throughout the process of designing the game to give it a better UX</li>
                                </ul>
                            </section>
                        </div>
                    </div>

                    <div className="header diploma">
                        <div className="cut-outs"><div /><div /><div /><div /></div>
                        <h1>Education</h1>
                    </div>

                    <div className="info-container full" style={{ marginTop: '1vw' }}>
                        <div className="title">
                            <h1>University</h1>
                            <div className="icon">
                                <svg strokeWidth="0" viewBox="0 0 512 512"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z">
                                    </path>
                                </svg>
                            </div>
                        </div>
                        <div className="content block">
                            {education.map(({ school, years, majors, minors }, i) =>
                                <section>
                                    <header>
                                        <h2>{school}:</h2>
                                        <em>{years}</em>
                                    </header>
                                    {majors?.length &&
                                        <h2>Major{majors.length > 1 ? 's' : ''}: {majors.map(({ short, long }, i) =>
                                            <Fragment key={`${school}-${short}-${i}`}>{i > 0 ? ', ' : ""}<strong>{short}</strong> ({long})</Fragment>)}
                                        </h2>}
                                    {minors?.length &&
                                        <h2>Minor{minors.length > 1 ? 's' : ''}: {minors.map(({ short, long }, i) =>
                                            <Fragment key={`${school}-${short}-${i}`}>{i > 0 ? ', ' : ""}<strong>{short}</strong> ({long})</Fragment>)}
                                        </h2>}
                                </section>
                            )}
                        </div>
                    </div>
                </main>
                <footer>
                    <h1>Last update: {new Date().toLocaleDateString('nu', { year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                </footer>
            </div>
        </Fragment >);
    }
}