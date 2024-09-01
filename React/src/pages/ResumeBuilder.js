import React, { Fragment, Component } from 'react';
import { projectData, projectsOrder, resumeData, skillData } from '../_data';
import '../css/builder.css';

const noteditable = {
    contentEditable: false,
    suppressContentEditableWarning: true,
}

export class ResumeBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            bodyState: document.body.id,
            skills: {
                coding: [],
                software: {},
                hidden: [],
                advanced: 90,
                intermediate: 70,
                beginner: 50,
                novice: 0,
            },
            projects: {
                hidden: [],
                work: [],
                personal: [],
            },
            colors: ['--OffRed', '--OffOrange', '--OffYellow', '--OffGreen', '--OffBlue', '--OffPurple',],
            url: 'pdf/resume_print_friendly.pdf',
            onePage: false,
            editing: false,
            viewHidden: false,
        }

        this.populateSkills();
        this.populateProjects();

        document.getElementById('loading')?.remove();
        document.title = `Jon Kido - Resume ${new Date().getFullYear()}`;
        document.body.className = 'builder'
    }

    async populateSkills() {
        let coding = [], software = {};
        const { skills, skills: { advanced, intermediate, beginner, novice } } = this.state;
        const levels = { novice, beginner, intermediate, advanced, };

        skillData.forEach(({ color, name, set }) => {
            set.forEach(({ name: sName, compentence, category }) => {
                const level = Object.keys(levels).reduce((a, b) => (levels[b] >= compentence && levels[b] > levels[a]) ? a : b, 'novice');
                if (category == 'software') {
                    if (!software[name]) software[name] = { set: [], name, color }
                    const { set } = software[name];
                    software[name].set = [...set, { name: sName, level }]
                } else coding.push({ name: sName, level })
            })
        });

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

    async populateProjects() {
        const { projects } = this.state;
        let work = [], personal = [];
        const projectSort = [...projectsOrder].sort((a, b) => {
            let aDate = projectData[a].endDate === 'Present' ? new Date() : new Date(projectData[a].endDate);
            let bDate = projectData[b].endDate === 'Present' ? new Date() : new Date(projectData[b].endDate);
            return bDate.valueOf() - aDate.valueOf()
        });

        for (const p of projectSort) {
            const { title, keyFeatures, stack, endDate: eDate, startDate: sDate, parent, isParent, link, fullName, } = projectData[p];
            const name = fullName ?? title;
            const [endMonth, , endYear] = eDate.split(/,?\ /);
            const [startMonth, , startYear] = sDate.split(/,?\ /);

            const data = {
                name, keyFeatures, stack, parent, link,
                startDate: `${startMonth} ${startYear}`,
                endDate: endMonth !== 'Present' ? `${endMonth} ${endYear}` : endMonth,
            };

            if (parent || isParent) work.push(data);
            else personal.push(data);
        }

        setTimeout(() => this.setState({
            projects: {
                ...projects, work, personal
            }
        }), 0);
    }

    print() {
        const { onePage } = this.state;
        let stylesheet = document.querySelector('style#printSettings');
        let styles = '';
        if (document.body.id == 'printer') {
            styles = `
            :root {
                --background:#fff !important;
            }`;
        }
        if (!stylesheet) {
            stylesheet = document.createElement('style');
            stylesheet.id = 'printSettings';
            stylesheet.type = 'text/css';
            stylesheet.innerText = styles;
            document.head.appendChild(stylesheet);
        }

        if (onePage) {
            const { offsetWidth, offsetHeight } = document.querySelector('.resume');
            styles += `
            @page{
                size: 8.5in ${8.5 * (offsetHeight / offsetWidth)}in;
            }`;
        }

        stylesheet.innerText = styles;

        window.print()
    }

    inStores({ android, apple }) {
        let list = []
        if (apple) list.push(<a href={apple} target='_blank'>App Store</a>)
        if (android) list.push(<a href={android} target='_blank'>Play Store</a>)
        return list.length ? <Fragment>
            In the {list.map((l, i) => <Fragment>{i ? ' & ' : ''}{l}</Fragment>)}
        </Fragment> : null
    }

    handleControls({ parentElement: controls, id }) {
        let target = controls.parentElement;
        setTimeout(this.updateHeight, 0)
        switch (id) {
            case 'visibility': return target.classList.toggle('no-print');
            case 'focus': return target.classList.toggle('present');
            default: return console.error('ERROR no control option for ', id)
        }
    }

    updateHeight() {
        const resume = document.querySelector('.resume');
        const container = document.querySelector('.resume-container');
        container.style.height = resume.offsetHeight * .7 + 30 + 'px'
    }

    render() {
        document.querySelector('style#printSettings')?.remove()
        setTimeout(this.updateHeight, 0)
        const { education, experience } = resumeData;
        const { bodyState, colors, editing, viewHidden, url, onePage,
            skills: { coding, software },
            projects: { work, personal }
        } = this.state;

        const controller =
            <div className='controls' {...noteditable} onClick={({ target }) => this.handleControls(target)}>
                <div id='focus' className='exp'></div>
                <div id='visibility' className='vis'></div>
                <div id='visibility' className='hid'></div>
            </div>

        return (<Fragment>
            <div className='no-print sticky-header'>
                <button className={`icon-button pages ${onePage}`} onClick={() => this.setState({ onePage: !onePage })} />
                <button className={`icon-button edit ${editing}`} onClick={() => this.setState({ editing: !editing })} />
                <button className={`icon-button hidden ${viewHidden}`} onClick={() => this.setState({ viewHidden: !viewHidden })} />
                <label>Url: <input onChange={(e) => this.setState({ url: e.target.value })} value={url} /></label>

                <div className='gap' />

                <button className={`icon-button modes ${!!bodyState}`} onClick={() => this.setState({ bodyState: document.body.id = document.body.id === 'printer' ? '' : 'printer' })} />
                <button className={`icon-button print`} onClick={() => this.print()} />
            </div>
            <div className='resume-container'>

                <div className={`resume ${viewHidden ? 'viewhidden' : ''}`} contentEditable={editing} suppressContentEditableWarning='true'>
                    <header  {...noteditable}>
                        <div className="header-container">
                            <div className="logo"></div>
                            <div className="title">
                                <h1>Jonathan Kido</h1>
                                <h4 contentEditable={editing} suppressContentEditableWarning='true'>Full Stack, Game Dev, Programmer</h4>
                            </div>
                        </div>
                        <div className="links">
                            <h5 className='email'>
                                <a href="mailto:jonkido@vfos.dev">jonkido@vfos.dev</a>
                            </h5>
                            <h5 className='globe'>
                                <a href="https://vfos.dev" target="_blank" rel="noreferrer">vfos.dev</a>
                            </h5>
                        </div>
                    </header>
                    <div id="alt" {...noteditable}>
                        {controller}
                        <h1>{bodyState ? 'Eye' : "Print"}-friendly version: <a href={`https://vfos.dev/${url}`}>{`https://vfos.dev/${url}`}</a></h1>
                    </div>
                    <main>
                        <div className="header gear">
                            <div className="cut-outs"><div /><div /><div /><div /></div>
                            <h1>Skills</h1>
                        </div>
                        <div className="skills-container">
                            <div className="info">
                                <div className="info-container">
                                    {controller}
                                    <h1 className="title coding">Coding</h1>
                                    <ul className="content row" style={{ '--color': 'var(--lightBlue)', '--visual-color': 'var(--OffWhite)' }}>
                                        {coding.map(({ name, level }, i) => <li key={`${name}-${i}`} className={level}>{controller}{name}</li>)}
                                    </ul>
                                </div>

                                <div className="info-container">
                                    {controller}
                                    <h1 className="title software">Software</h1>
                                    <div className="content row" style={{ '--visual-color': 'var(--OffWhite)' }}>
                                        {Object.keys(software).map((s, i) => {
                                            const { set = [], name } = software[s]
                                            return <ul className="container" style={{ '--color': `var(${colors[i % colors.length]})` }}>
                                                {controller}
                                                {set.map(({ name, level }, i) => <li key={`${name}-${i}`} className={level}>{controller}{name}</li>)}
                                                <div className="category">
                                                    {name}
                                                </div>
                                            </ul>
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className='legend-side'>
                                <div className="legend content" style={{ '--visual-color': 'var(--background)' }} {...noteditable}>
                                    {controller}
                                    <div className="advanced">Professional</div>
                                    <div className="intermediate">Advanced</div>
                                    <div className="beginner">Intermediate</div>
                                    <div className="novice">Beginner</div>
                                </div>

                                <h1 className="more-info">
                                    {controller}
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
                            {controller}
                            <h1 className="title building">Professional Experience</h1>
                            <div className="content block">
                                {experience.map(({ title, subTitle, company, dates, keyPoints }) => {
                                    let points = keyPoints.split('\t ');
                                    return (<section key={`${title}${company}${subTitle}`} className='autopagebreak'>
                                        {controller}
                                        <header>
                                            <h2>{title}{subTitle ? `, ${subTitle}` : ""} - {company}</h2>
                                            <em>{dates}</em>
                                        </header>
                                        <ul>
                                            {points.length > 1 ?
                                                <Fragment>
                                                    {points.map(p => p.replace(/(\s|\n)+/, '') ? <li key={`${company}${p}`}>{p}</li> : '')}
                                                </Fragment> :
                                                <Fragment>
                                                    <li>Bullet Points not found in data set</li>
                                                </Fragment>
                                            }
                                        </ul>
                                    </section>);
                                })}
                            </div>
                        </div>

                        <div className="info-container full">
                            {controller}
                            <h1 className="title work">Work/Group Projects</h1>
                            <div className="content block">
                                {work.map(({ name, keyFeatures = '', stack, endDate, startDate, parent, link: { website, ...rem } = {}, }) => {
                                    let link = website === '/' ? 'https://vfos.dev' : website
                                    let bulletpoint = this.inStores(rem)
                                    let points = keyFeatures.split('- ');
                                    return (<section className='autopagebreak'>
                                        {controller}
                                        <header>
                                            <h2>{name} {link ? <Fragment>
                                                (<a href={link} target="_blank">{link}</a>)
                                            </Fragment> : ""}</h2>
                                            <em>{startDate}{endDate !== startDate ? ` - ${endDate}` : ''}</em>
                                        </header>
                                        <ul>
                                            {points.length > 1 ?
                                                <Fragment>
                                                    {points.map(p => p.replace(/(\s|\n)+/, '') ? <li key={`${name}${p}`}>{p}</li> : '')}
                                                </Fragment> :
                                                <Fragment>
                                                    <li>Bullet Points not found in data set</li>
                                                </Fragment>
                                            }
                                            {!!bulletpoint && <li>{bulletpoint}</li>}
                                        </ul>
                                    </section>)
                                })}
                            </div>
                        </div>

                        <div className="info-container full">
                            {controller}
                            <h1 className="title personal">Personal Projects</h1>
                            <div className="content block">
                                {personal.map(({ name, keyFeatures = '', stack, endDate, startDate, parent, link: { website, ...rem } = {}, }) => {
                                    let link = website === '/' ? 'https://vfos.dev' : website;
                                    let bulletpoint = this.inStores(rem)
                                    let points = keyFeatures.split('- ');
                                    return (<section className='autopagebreak'>
                                        {controller}
                                        <header>
                                            <h2>{name} {link ? <Fragment>
                                                (<a href={link} target="_blank">{link}</a>)
                                            </Fragment> : ""}</h2>
                                            <em>{startDate}{endDate !== startDate ? ` - ${endDate}` : ''}</em>
                                        </header>
                                        <ul>
                                            {points.length > 1 ?
                                                <Fragment>
                                                    {points.map(p => p.replace(/(\s|\n)+/, '') ? <li key={`${name}${p}`}>{p}</li> : '')}
                                                </Fragment> :
                                                <Fragment>
                                                    <li>Bullet Points not found in data set</li>
                                                </Fragment>
                                            }
                                            {!!bulletpoint && <li>{bulletpoint}</li>}
                                        </ul>
                                    </section>)
                                })}
                            </div>
                        </div>

                        <div className="header diploma">
                            <div className="cut-outs"><div /><div /><div /><div /></div>
                            <h1>Education</h1>
                        </div>

                        <div className="info-container full" style={{ marginTop: '1vw' }}>
                            {controller}
                            <h1 className="title university">University</h1>
                            <div className="content block">
                                {education.map(({ school, years, majors, minors }, i) =>
                                    <section className='autopagebreak'>
                                        {controller}
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
                    </main >
                    <footer>
                        <h1>Last update: {new Date().toLocaleDateString('nu', { year: 'numeric', month: 'long', day: 'numeric' })}</h1>
                    </footer>
                </div >
            </div>
        </Fragment >);
    }
}