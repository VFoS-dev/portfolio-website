import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Skills extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            scrolled: "-1",
            updatedRefs: false,
            onScreen: [true, false, false, false, false, false, false, false]
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

    mapSkills(title, entries, refIndex, color) {
        const { onScreen } = this.state;
        return <Fragment>
            <div style={{ width: "100%", height: "100%", overflow: 'hidden', position: "absolute", zIndex: 0, borderRadius: "30px" }}>
                <div id='stars' />
                <div id='stars2' />
                <div id='stars3' />
            </div>
            <div style={{
                zIndex: 2,
                padding: '18px'
            }}>
                <center>
                    <h1 style={color ? { color: color } : {}}>{title}</h1>
                </center>
                {entries.map(n => (
                    <div className='segment'>
                        <h3 className='title' style={color ? { color: color } : {}}>{n.name}</h3>
                        <h6 className='percent' style={color ? { color: color } : {}}>{n.compentence}%</h6>
                        <div class="progress" style={{ backgroundColor: "none" }} >
                            <img src="/images/skills/hilt.png" style={{ zIndex: 1 }} />
                            <div class="progress-bar clear" style={{ width: `calc(${n.compentence}% - 90px)` }}>
                                <div className={`light ${onScreen[refIndex] ? "in" : "out"}`}
                                    style={color ? {
                                        boxShadow: `0 0 5px #fff, 0 0 12px #fff, 0 0 15px ${color}, 0 0 35px ${color}`
                                    } : {}} />
                            </div>
                        </div>
                    </div>))}
            </div>
        </Fragment>
    }

    render() {
        if (this.props.scrolled != this.state.scrolled) this.userScrolled()
        if (!this.state.updatedRefs) setTimeout(() => this.userScrolled(), 0)

        return (<div className="skills">
            <div className='navpadding' />
            <div className='flex-container'>
                <div className='flex-catagory' ref={this.appRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px blue", position: "relative" }}>
                    {this.mapSkills("Applications", [
                        { name: 'Adobe Animate', compentence: 95 },
                        { name: 'Blender', compentence: 73 },
                        { name: 'Insomnia', compentence: 86 },
                        { name: 'Krita', compentence: 80 },
                        { name: 'Maya', compentence: 32 },
                        { name: 'Photoshop', compentence: 60 },
                        { name: 'Substance Painter', compentence: 67 },
                        { name: 'Unity', compentence: 90 },
                        { name: 'Unreal', compentence: 66 },
                    ], 0, "blue")}
                </div >

                <div className='flex-catagory' ref={this.frameRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px magenta", position: "relative" }}>
                    {this.mapSkills("Frameworks", [
                        { name: '.Net', compentence: 72 },
                        { name: 'Bootstrap', compentence: 93 },
                        { name: 'Express.js', compentence: 95 },
                        { name: 'Ionic', compentence: 70 },
                        { name: 'Node.js', compentence: 80 },
                        { name: 'React', compentence: 97 },
                        { name: 'React Native', compentence: 90 },
                    ], 1, "magenta")}
                </div>
                <div className='flex-catagory' ref={this.codRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px orange", position: "relative" }}>
                    {this.mapSkills("Coding Languages", [
                        { name: 'ActionScript 3 (AS3)', compentence: 98 },
                        { name: 'AutoHotKey (AHK)', compentence: 75 },
                        { name: 'C++', compentence: 65 },
                        { name: 'C#', compentence: 95 },
                        { name: 'Javascript', compentence: 100 },
                        { name: 'Python', compentence: 75 },
                        { name: 'Swift', compentence: 30 },
                    ], 2, "orange")}
                </div>
                <div className='flex-catagory' ref={this.derRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px yellow", position: "relative" }}>
                    {this.mapSkills("Language Derivatives", [
                        { name: 'CSS', compentence: 95 },
                        { name: 'HTML', compentence: 98 },
                        { name: 'JSON', compentence: 100 },
                        { name: 'MarkDown', compentence: 86 },
                    ], 3, "yellow")}
                </div>
                <div className='flex-catagory' ref={this.dataRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px purple", position: "relative" }}>
                    {this.mapSkills("Databases", [
                        { name: 'MongoDB', compentence: 90 },
                        { name: 'SQLite', compentence: 87 },
                    ], 4, "purple")}
                </div>
                <div className='flex-catagory' ref={this.versRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px green", position: "relative" }}>
                    {this.mapSkills("Version Control", [
                        { name: 'git', compentence: 80 },
                        { name: 'github', compentence: 89 },
                    ], 5, "green")}
                </div>
                <div className='flex-catagory' ref={this.cloudRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px white", position: "relative" }}>
                    {this.mapSkills("Cloud Services", [
                        { name: 'AWS', compentence: 90 },
                        { name: 'Azure', compentence: 50 },
                        { name: 'Firebase', compentence: 70 },
                        { name: 'Google APIs', compentence: 93 },
                        { name: 'MongoDB Atlas', compentence: 87 },
                        { name: 'NGINX', compentence: 83 },
                    ], 6, "white")}
                </div>
                <div className='flex-catagory' ref={this.miscRef} style={{ boxShadow: "0 0 5px #fff, 0 0 15px red", position: "relative" }}>
                    {this.mapSkills("Misc.", [
                        { name: 'Agile Methodology', compentence: 99 },
                    ], 7, "red")}
                </div>
            </div>
        </div >);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedSkills = connect(mapState, actionCreators)(Skills);
export { connectedSkills as Skills };