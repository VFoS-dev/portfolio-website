import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/skills.css';
import '../css/stars.css';

class Skills extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scrolled: "-1",
            updatedRefs: false,
            onScreen: [false, false, false, false, false, false, false, false],
            filters: [true, true, true, true, true, true, true, true]
        }

        this.appRef = React.createRef();
        this.frameRef = React.createRef();
        this.codRef = React.createRef();
        this.derRef = React.createRef();
        this.dataRef = React.createRef();
        this.versRef = React.createRef();
        this.cloudRef = React.createRef();
        this.miscRef = React.createRef();
    }

    userScrolled() {
        const refs = [this.appRef, this.frameRef, this.codRef, this.derRef, this.dataRef, this.versRef, this.cloudRef, this.miscRef]
        const f = document.getElementById("focused")
        this.setState({
            scrolled: this.props.scrolled,
            updatedRefs: true,
            onScreen: refs.map(r => {
                const c = r.current
                return (f?.scrollTop + document.documentElement.clientHeight > c?.offsetTop + document.documentElement.clientHeight * 1 / 5) || (f?.scrollTop + document.documentElement.clientHeight > f?.scrollHeight - 100);
            })
        })
    }

    mapSkills(title, entries, refIndex, color, textColor = null) {
        const { onScreen } = this.state;
        const sorted = JSON.parse(`{${JSON.parse(JSON.stringify(entries)).sort((a, b) => b.compentence - a.compentence).map((a, index) => `"${a.name}":${index}`).join(',')}}`)
        return <Fragment>
            <div style={{ width: "100%", height: "100%", overflow: 'hidden', position: "absolute", zIndex: 0, borderRadius: "30px", pointerEvents: 'none' }}>
                <div id='stars' />
                <div id='stars2' />
                <div id='stars3' />
            </div>
            <center>
                <h1 style={{
                    paddingTop: '18px', ...(color || textColor ? { color: textColor || color } : {})
                }}>{title}</h1>
            </center>
            <div style={{
                zIndex: 2,
                margin: '18px',
                height: `calc(60px * ${entries.length})`,
                position: 'relative'
            }}>
                {entries.map((n, index) => (
                    <div key={n.name} className='segment' style={{ '--base-height': `${60 * index}px`, '--sorted-height': `${60 * sorted[n.name]}px` }}>
                        <h3 className='title relative' style={color || textColor ? { color: textColor || color } : {}}>{n.name}
                            {!!n.linkedin && <div className='linkedinApproved'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="#0a66c2" class="mercado-match" height="100%" width="auto" focusable="false">
                                    <path d="M14.73 10H17l-5.5 8L8 14.5l1.34-1.34L11.21 15zM20 3v16a3 3 0 01-3 3H7a3 3 0 01-3-3V3h5.69l.52-1A2 2 0 0112 1a2 2 0 011.76 1l.52 1zm-2 2h-2.6l.6 1.1V7H8v-.9L8.6 5H6v14a1 1 0 001 1h10a1 1 0 001-1z"></path>
                                </svg>
                            </div >}
                            <h6 className='percent' style={color || textColor ? { color: textColor || color } : {}}>{n.compentence}%</h6>
                        </h3>
                        <div className="progress" style={{ backgroundColor: "none" }} >
                            <img className='hilt' src="/images/skills/hilt.png" style={{ zIndex: 1 }} alt='' />
                            <div className="progress-bar clear" style={{ width: `calc(${n.compentence}% - 90px)` }}>
                                <div className={`light${onScreen[refIndex] ? ' in' : ''}`}
                                    style={color ? {
                                        boxShadow: `0 0 5px #fff, 0 0 12px #fff, 0 0 15px ${color}, 0 0 35px ${color}`,
                                        width: `${onScreen[refIndex] * 100}%`
                                    } : {}} />
                            </div>
                        </div>
                    </div>))}
            </div>
        </Fragment >
    }

    filter(index) {
        const { filters } = this.state
        filters[index] = !filters[index];
        this.setState({ filters: filters })
    }

    render() {
        const { filters } = this.state;
        if (this.props.scrolled !== this.state.scrolled) setTimeout(() => this.userScrolled(), 0)
        if (!this.state.updatedRefs) setTimeout(() => this.userScrolled(), 0)

        return (<div className="skills">
            <div className='navpadding' />
            <div className='flex-container'>
                <div className={`flex-catagory ${filters[0] || 'filtered'}`} ref={this.appRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px blue", position: "relative" }}>
                    <div className='skills-filter' id="0" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="blue" fill="blue" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Applications", [
                        { name: 'Adobe Animate', compentence: 95 },
                        { name: 'Blender', compentence: 73 },
                        { name: 'Insomnia', compentence: 80 },
                        { name: 'Krita', compentence: 78 },
                        { name: 'Maya', compentence: 32 },
                        { name: 'Photoshop', compentence: 60 },
                        { name: 'Substance Painter', compentence: 40 },
                        { name: 'Unity', compentence: 90 },
                        { name: 'Unreal', compentence: 66 },
                    ], 0, "blue", '#335cff')}
                </div>
                <div className={`flex-catagory ${filters[1] || 'filtered'}`} ref={this.frameRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px magenta", position: "relative" }}>
                    <div className='skills-filter' id="1" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="magenta" fill="magenta" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Frameworks", [
                        { name: '.Net', compentence: 65 },
                        { name: 'Bootstrap', compentence: 76 },
                        { name: 'Express.js', compentence: 90 },
                        { name: 'Ionic', compentence: 50 },
                        { name: 'JQuery', compentence: 83, linkedin: 5 },
                        { name: 'Node.js', compentence: 80 },
                        { name: 'React', compentence: 96 },
                        { name: 'React Native', compentence: 80 },
                    ], 1, "magenta")}
                </div>
                <div className={`flex-catagory ${filters[2] || 'filtered'}`} ref={this.codRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px orange", position: "relative" }}>
                    <div className='skills-filter' id="2" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="orange" fill="orange" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Coding Languages", [
                        { name: 'ActionScript 3 (AS3)', compentence: 93 },
                        { name: 'AutoHotKey (AHK)', compentence: 60 },
                        { name: 'C++', compentence: 65 },
                        { name: 'C#', compentence: 82 },
                        { name: 'Javascript', compentence: 100, linkedin: 30 },
                        { name: 'Python', compentence: 70 },
                        { name: 'Swift', compentence: 20 },
                    ], 2, "orange")}
                </div>
                <div className={`flex-catagory ${filters[3] || 'filtered'}`} ref={this.derRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px yellow", position: "relative" }}>
                    <div className='skills-filter' id="3" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="yellow" fill="yellow" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Language Derivatives", [
                        { name: 'CSS', compentence: 93, linkedin: 5 },
                        { name: 'HTML', compentence: 90, linkedin: 5 },
                        { name: 'JSON', compentence: 100, linkedin: 30 },
                        { name: 'MarkDown', compentence: 75 },
                        { name: 'RegEx', compentence: 94 },
                    ], 3, "yellow")}
                </div>
                <div className={`flex-catagory ${filters[4] || 'filtered'}`} ref={this.dataRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px purple", position: "relative" }}>
                    <div className='skills-filter' id="4" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="#a733ff" fill="#a733ff" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Databases", [
                        { name: 'MongoDB', compentence: 90 },
                        { name: 'SQLite', compentence: 83 },
                    ], 4, "#a733ff")}
                </div>
                <div className={`flex-catagory ${filters[5] || 'filtered'}`} ref={this.versRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px green", position: "relative" }}>
                    <div className='skills-filter' id="5" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="green" fill="green" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Version Control", [
                        { name: 'git', compentence: 80 },
                        { name: 'github', compentence: 89 },
                    ], 5, "green")}
                </div>
                <div className={`flex-catagory ${filters[6] || 'filtered'}`} ref={this.cloudRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px white", position: "relative" }}>
                    <div className='skills-filter' id="6" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="white" fill="white" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Cloud Services", [
                        { name: 'AWS', compentence: 93 },
                        { name: 'Azure', compentence: 50 },
                        { name: 'Firebase', compentence: 63 },
                        { name: 'Google APIs', compentence: 83 },
                        { name: 'MongoDB Atlas', compentence: 87 },
                        { name: 'NGINX', compentence: 90 },
                    ], 6, "white")}
                </div>
                <div className={`flex-catagory ${filters[7] || 'filtered'}`} ref={this.miscRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px red", position: "relative" }}>
                    <div className='skills-filter' id="7" onClick={(e) => this.filter(e.target.id)}>
                        <svg stroke="red" fill="red" stroke-width="0" viewBox="0 0 16 16" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                    </div>
                    {this.mapSkills("Misc.", [
                        { name: 'Agile Methodology', compentence: 99 },
                        { name: 'Visual Studio', compentence: 93 },
                        { name: 'VMware', compentence: 87 },
                        { name: 'VS Code', compentence: 83 },
                    ], 7, "red")}
                </div>
            </div>
        </div>);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedSkills = connect(mapState, actionCreators)(Skills);
export { connectedSkills as Skills };

/*
*/