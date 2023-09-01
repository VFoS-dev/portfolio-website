import React, { Fragment, Component } from 'react';
import { projectData, resumeData, skillData } from '../_data';
import '../css/builder.css';

export class ResumeBuilder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bodyState: ''
        }
        document.getElementById('loading')?.remove();
        document.getElementById('root').classList = '';
        document.title = 'Resume Builder - VFoS | Jon Kido';
        document.body.className = 'builder'
    }

    togglePrintFriendly = () => this.setState({ bodyState: document.body.id = document.body.id === 'printer' ? '' : 'printer' });

    render() {
        const { bodyState } = this.state;
        return (<Fragment>
            <header>
                <div className="header-container">
                    <div className="logo"></div>
                    <div className="title">
                        <h1>Jonathan Kido</h1>
                        <h4>Full Stack, Game Dev, Programmer</h4>
                    </div>
                </div>
                <div className="links">
                    <h5><a href="mailto:jonkido@vfos.dev">jonkido@vfos.dev
                        <div className="icon">
                            <svg strokeWidth="0" viewBox="0 0 24 24" width="100%"
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
                            <svg strokeWidth="0" viewBox="0 0 1024 1024" width="100%"
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
                <div className="header">
                    <div className="cut-outs">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="icon">
                        <svg strokeWidth="0" viewBox="0 0 16 16" width="100%" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z">
                            </path>
                            <path
                                d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z">
                            </path>
                        </svg>
                    </div>
                    <h1>Skills</h1>
                </div>
                <h1 className="more-info">Not seeing a skill? View the rest on my portfolio: <a href="https://vfos.dev/skills">https://vfos.dev/skills</a></h1>
                <div className="skills-container">
                    <div className="info">
                        <div className="info-container">
                            <div className="title">
                                <h1>Coding</h1>
                                <div className="icon">
                                    <svg strokeWidth="0" viewBox="0 0 20 20" width="100%"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd"
                                            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                                            clipRule="evenodd"></path>
                                    </svg>
                                </div>
                            </div>
                            <div className="content row" style={{ '--color': 'var(--lightBlue)', '--visual-color': 'var(--OffWhite)' }}>
                                <div className="advanced">CSS <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="advanced">HTML <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="advanced">JavaScript <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="advanced">React <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="intermediate">React Native <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="intermediate">NodeJS <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="intermediate">ExpressJS <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="intermediate">C# <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="beginner">C++ <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="beginner">Bootstrap <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="beginner">Python <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                                <div className="novice">Swift <div className="visual">
                                    <div></div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="info-container">
                            <div className="title">
                                <h1>Software</h1>
                                <div className="icon">
                                    <svg strokeWidth="0" viewBox="0 0 16 16" width="100%"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10.875 7l2.008 5h-.711l-2.008-5h.711zm-5.125.594c-.276 0-.526.041-.75.125a1.542 1.542 0 0 0-.578.375c-.162.166-.287.37-.375.61a2.364 2.364 0 0 0-.133.827c0 .287.04.547.117.781.078.235.196.433.352.594.156.162.346.29.57.383.224.094.48.138.766.133a2.63 2.63 0 0 0 .992-.195l.125.484a1.998 1.998 0 0 1-.492.148 4.381 4.381 0 0 1-.75.07 2.61 2.61 0 0 1-.914-.156 2.207 2.207 0 0 1-.742-.453 1.878 1.878 0 0 1-.485-.742 3.204 3.204 0 0 1-.18-1.023c0-.365.06-.698.18-1 .12-.302.287-.563.5-.782.214-.218.471-.388.774-.507a2.69 2.69 0 0 1 1-.18c.296 0 .536.023.718.07.183.047.315.094.399.14l-.149.493a1.85 1.85 0 0 0-.406-.14 2.386 2.386 0 0 0-.539-.055zM8 8h1v1H8V8zm0 2h1v1H8v-1z">
                                        </path>
                                        <path d="M15.5 1H.5l-.5.5v13l.5.5h15l.5-.5v-13l-.5-.5zM15 14H1V5h14v9zm0-10H1V2h14v2z">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                            <div className="content row" style={{ '--visual-color': 'var(--OffWhite)' }}>
                                <div className="container" style={{ '--color': 'var(--OffRed)' }}>
                                    <div className="intermediate">GIT <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="advanced">GitHub Desktop <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="category">
                                        Version Control
                                    </div>
                                </div>

                                <div className="container" style={{ '--color': 'var(--OffOrange)' }}>
                                    <div className="advanced">AWS <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="intermediate">Google APIs <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="intermediate">Firebase <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="category">
                                        Cloud Services
                                    </div>
                                </div>

                                <div className="container" style={{ '--color': 'var(--OffYellow)' }}>
                                    <div className="advanced">MongoDB <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="intermediate">SQLite <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="category">
                                        Databases
                                    </div>
                                </div>

                                <div className="container" style={{ '--color': 'var(--OffGreen)' }}>
                                    <div className="advanced">VS Code <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="intermediate">Visual Studio <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="intermediate">VMware <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="category">
                                        IDEs & Misc
                                    </div>
                                </div>

                                <div className="container" style={{ '--color': 'var(--OffBlue)' }}>
                                    <div className="advanced">Unity <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="beginner">Unreal Engine 5 <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="category">
                                        Game Engines
                                    </div>
                                </div>

                                <div className="container" style={{ '--color': 'var(--OffPurple)' }}>
                                    <div className="advanced">Excel <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="advanced">Word <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="intermediate">PowerPoint <div className="visual">
                                        <div></div>
                                    </div>
                                    </div>
                                    <div className="category">
                                        Office
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="legend content" style={{ '--visual-color': 'var(--background)' }}>
                        <div className="advanced">Advanced
                            <div className="visual">
                                <div></div>
                            </div>
                        </div>
                        <div className="intermediate">Intermediate
                            <div className="visual">
                                <div></div>
                            </div>
                        </div>
                        <div className="beginner">Beginner
                            <div className="visual">
                                <div></div>
                            </div>
                        </div>
                        <div className="novice">Novice
                            <div className="visual">
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="header">
                    <div className="cut-outs">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="icon">
                        <svg strokeWidth="0" viewBox="0 0 16 16" width="100%" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M3.75 4.48h-.71L2 3.43l.71-.7.69.68L4.81 2l.71.71-1.77 1.77zM6.99 3h8v1h-8V3zm0 3h8v1h-8V6zm8 3h-8v1h8V9zm-8 3h8v1h-8v-1zM3.04 7.48h.71l1.77-1.77-.71-.7L3.4 6.42l-.69-.69-.71.71 1.04 1.04zm.71 3.01h-.71L2 9.45l.71-.71.69.69 1.41-1.42.71.71-1.77 1.77zm-.71 3.01h.71l1.77-1.77-.71-.71-1.41 1.42-.69-.69-.71.7 1.04 1.05z">
                            </path>
                        </svg>
                    </div>
                    <h1>Experience</h1>
                </div>

                <h1 className="more-info">Learn more about these and other projects on my portfolio: <a
                    href="https://vfos.dev/projects">https://vfos.dev/projects</a></h1>

                <div className="info-container full">
                    <div className="title">
                        <h1>Professional Experience</h1>
                        <div className="icon">
                            <svg strokeWidth="0" viewBox="0 0 24 24" aria-hidden="true" width="100%"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M3 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5H15v-18a.75.75 0 000-1.5H3zM6.75 19.5v-2.25a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75zM6 6.75A.75.75 0 016.75 6h.75a.75.75 0 010 1.5h-.75A.75.75 0 016 6.75zM6.75 9a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM6 12.75a.75.75 0 01.75-.75h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 6a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zm-.75 3.75A.75.75 0 0110.5 9h.75a.75.75 0 010 1.5h-.75a.75.75 0 01-.75-.75zM10.5 12a.75.75 0 000 1.5h.75a.75.75 0 000-1.5h-.75zM16.5 6.75v15h5.25a.75.75 0 000-1.5H21v-12a.75.75 0 000-1.5h-4.5zm1.5 4.5a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zm.75 2.25a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75h-.008zM18 17.25a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008z"
                                    clipRule="evenodd"></path>
                            </svg>
                        </div>
                    </div>
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

                <div className="pagebreak"></div>
                <div className="pagebreak-spacing" />

                <div className="info-container full">
                    <div className="title">
                        <h1>GIMM Works Projects (Full Stack Projects)</h1>
                        <div className="icon">
                            <svg strokeWidth="0" viewBox="0 0 16 16" width="100%"
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
                            <svg strokeWidth="0" viewBox="0 0 496 512" width="100%"
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

                <div className="header">
                    <div className="cut-outs">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div className="icon">
                        <svg strokeWidth="0" viewBox="0 0 512 512" width="100%"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M440.41 67.996C305.221 82.672 154.69 102.263 24.955 128.82l41.068 278.137c84.113-17.286 175.36-32.728 265.59-45.207a404.446 404.446 0 0 0-4.63-19.385C245.851 354.53 163.671 369.2 90.36 385.582l-9.457 2.113-34.42-233.98-1.199-8.162 8.028-1.903c117.04-27.75 246.945-46.473 361.992-55.459l8.101-.632 42.905 236.183-9.498 1.131a4251.105 4251.105 0 0 0-36.885 4.574 515.021 515.021 0 0 0 5.328 20.397c20.837-2.417 41.486-4.672 61.789-6.701zm-31.794 38.846c-109.549 8.936-231.99 26.686-343.111 52.513L95.9 365.988c67.613-14.83 141.885-28.138 215.711-39.42-8.203-8.985-12.553-20.468-13.465-32.668-1.029-13.772 7.132-25.138 16.83-33.238 9.699-8.1 21.523-13.738 32.178-16.762 8.076-2.291 17.439-3.63 26.91-3.377a79.69 79.69 0 0 1 9.465.809c12.549 1.849 25.402 7.232 32.063 19.29 8.874 16.064 8.83 34.87 3.006 50.94a4202.77 4202.77 0 0 1 26.601-3.328zM173.4 172.346l2.631 17.804-73.998 10.926-2.629-17.805zm112.774 40.562l3.015 17.744-176.535 29.989-3.013-17.745zm-40.02 42.744l3.002 17.746-130.05 22.008-3.002-17.746zm124.649 2.895c-6.602.12-13.295 1.125-18.733 2.668-8.206 2.329-18.358 7.251-25.554 13.262-7.196 6.01-10.85 12.302-10.418 18.082.841 11.258 4.644 19.335 12.982 25.699 8.338 6.364 22.136 10.986 43.193 11.719 11.576.402 21.654-7.628 27.588-20.147 5.934-12.519 6.623-28.477-.021-40.506-2.916-5.279-9.587-8.808-18.934-10.185a58.923 58.923 0 0 0-7.283-.588 71.452 71.452 0 0 0-2.82-.004zm32.095 77.205c-8.366 7.734-19.065 12.635-31.25 12.21-9.477-.329-17.995-1.37-25.625-3.11 11.987 47.995 15.644 99.063 19.436 146.17 12.367-8.327 22.462-19.54 28.582-36.221l4.924-13.422 9.973 10.244c12.052 12.381 25.366 19.027 39.718 24.55-14.655-44.078-34.119-92.013-45.758-140.421z">
                            </path>
                        </svg>
                    </div>
                    <h1>Education</h1>
                </div>

                <div className="info-container full" style={{ marginTop: '1vw' }}>
                    <div className="title">
                        <h1>University</h1>
                        <div className="icon">
                            <svg strokeWidth="0" viewBox="0 0 512 512" width="100%"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M496 128v16a8 8 0 0 1-8 8h-24v12c0 6.627-5.373 12-12 12H60c-6.627 0-12-5.373-12-12v-12H24a8 8 0 0 1-8-8v-16a8 8 0 0 1 4.941-7.392l232-88a7.996 7.996 0 0 1 6.118 0l232 88A8 8 0 0 1 496 128zm-24 304H40c-13.255 0-24 10.745-24 24v16a8 8 0 0 0 8 8h464a8 8 0 0 0 8-8v-16c0-13.255-10.745-24-24-24zM96 192v192H60c-6.627 0-12 5.373-12 12v20h416v-20c0-6.627-5.373-12-12-12h-36V192h-64v192h-64V192h-64v192h-64V192H96z">
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div className="content block">
                        <section>
                            <header>
                                <h2>Boise State University:</h2>
                                <em>August 2017 - December 2022</em>
                            </header>
                            <h2>Major: <strong>GIMM</strong> (Games, Interactive Media, and Mobile)</h2>
                            <div className="minors">
                                <h2>Minors: </h2>
                                <h2>
                                    <div><strong>MATH</strong> (Applied Mathematics),</div>
                                    <div><strong>ITM</strong> (Information Technology Management) </div>
                                </h2>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <footer>
                <h1>Last update: {new Date().toString()}</h1>
            </footer>
        </Fragment >);
    }
}