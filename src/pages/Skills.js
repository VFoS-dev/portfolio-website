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
            onScreen: [false, false, false, false, false, false, false, false]
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
                        <h3 className='title' style={color || textColor ? { color: textColor || color } : {}}>{n.name}</h3>
                        <h6 className='percent' style={color || textColor ? { color: textColor || color } : {}}>{n.compentence}%</h6>
                        <div className="progress" style={{ backgroundColor: "none" }} >
                            <img className='hilt' src="/images/skills/hilt.png" style={{ zIndex: 1 }} />
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

    render() {
        if (this.props.scrolled != this.state.scrolled) setTimeout(() => this.userScrolled(), 0)
        if (!this.state.updatedRefs) setTimeout(() => this.userScrolled(), 0)

        return (<div className="skills">
            <div className='navpadding' />
            <div className='flex-container'>
                <div className='flex-catagory' ref={this.appRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px blue", position: "relative" }}>
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
                <div className='flex-catagory' ref={this.frameRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px magenta", position: "relative" }}>
                    {this.mapSkills("Frameworks", [
                        { name: '.Net', compentence: 65 },
                        { name: 'Bootstrap', compentence: 76 },
                        { name: 'Express.js', compentence: 90 },
                        { name: 'Ionic', compentence: 50 },
                        { name: 'Node.js', compentence: 80 },
                        { name: 'React', compentence: 96 },
                        { name: 'React Native', compentence: 80 },
                    ], 1, "magenta")}
                </div>
                <div className='flex-catagory' ref={this.codRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px orange", position: "relative" }}>
                    {this.mapSkills("Coding Languages", [
                        { name: 'ActionScript 3 (AS3)', compentence: 93 },
                        { name: 'AutoHotKey (AHK)', compentence: 60 },
                        { name: 'C++', compentence: 65 },
                        { name: 'C#', compentence: 82 },
                        { name: 'Javascript', compentence: 100 },
                        { name: 'Python', compentence: 70 },
                        { name: 'Swift', compentence: 20 },
                    ], 2, "orange")}
                </div>
                <div className='flex-catagory' ref={this.derRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px yellow", position: "relative" }}>
                    {this.mapSkills("Language Derivatives", [
                        { name: 'CSS', compentence: 80 },
                        { name: 'HTML', compentence: 90 },
                        { name: 'JSON', compentence: 100 },
                        { name: 'MarkDown', compentence: 75 },
                    ], 3, "yellow")}
                </div>
                <div className='flex-catagory' ref={this.dataRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px purple", position: "relative" }}>
                    {this.mapSkills("Databases", [
                        { name: 'MongoDB', compentence: 90 },
                        { name: 'SQLite', compentence: 83 },
                    ], 4, "#a733ff")}
                </div>
                <div className='flex-catagory' ref={this.versRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px green", position: "relative" }}>
                    {this.mapSkills("Version Control", [
                        { name: 'git', compentence: 80 },
                        { name: 'github', compentence: 89 },
                    ], 5, "green")}
                </div>
                <div className='flex-catagory' ref={this.cloudRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px white", position: "relative" }}>
                    {this.mapSkills("Cloud Services", [
                        { name: 'AWS', compentence: 93 },
                        { name: 'Azure', compentence: 50 },
                        { name: 'Firebase', compentence: 63 },
                        { name: 'Google APIs', compentence: 83 },
                        { name: 'MongoDB Atlas', compentence: 87 },
                        { name: 'NGINX', compentence: 90 },
                    ], 6, "white")}
                </div>
                <div className='flex-catagory' ref={this.miscRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px red", position: "relative" }}>
                    {this.mapSkills("Misc.", [
                        { name: 'Agile Methodology', compentence: 99 },
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