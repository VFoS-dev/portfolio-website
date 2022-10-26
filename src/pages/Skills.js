import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Skills extends React.Component {
    mapSkills(name, perc) {
        return (<>
            <div className='segment'>
                <h3 className='title'>{name}</h3>
                <h6 className='percent'>{perc}%</h6>
                <div class="progress">
                    <div class="progress-bar ani" role="progressbar" style={{ width: `${perc}%` }} aria-valuemax="100"></div>
                </div>
            </div>
        </>);
    }

    render() {
        return (<div className="skills" onScroll={(e) => this.props.onScroll(e)}>
            <div className='navpadding' />
            <center><h1>Skills</h1></center>
            <br />
            <div className='flex-container'>
                <div className='flex-catagory'>
                    <center>
                        <h1>Applications</h1>
                    </center>
                    {[
                        { name: 'Adobe Animate', compentence: 95 },
                        { name: 'Blender', compentence: 73 },
                        { name: 'Insomnia', compentence: 86 },
                        { name: 'Krita', compentence: 80 },
                        { name: 'Maya', compentence: 32 },
                        { name: 'Photoshop', compentence: 60 },
                        { name: 'Substance Painter', compentence: 67 },
                        { name: 'Unity', compentence: 90 },
                        { name: 'Unreal', compentence: 66 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Frameworks</h1>
                    </center>
                    {[
                        { name: '.Net', compentence: 72 },
                        { name: 'Bootstrap', compentence: 93 },
                        { name: 'Express.js', compentence: 95 },
                        { name: 'Ionic', compentence: 70 },
                        { name: 'Node.js', compentence: 80 },
                        { name: 'React', compentence: 97 },
                        { name: 'React Native', compentence: 90 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Coding Languages</h1>
                    </center>
                    {[
                        { name: 'ActionScript 3 (AS3)', compentence: 98 },
                        { name: 'AutoHotKey (AHK)', compentence: 75 },
                        { name: 'C++', compentence: 65 },
                        { name: 'C#', compentence: 95 },
                        { name: 'Javascript', compentence: 100 },
                        { name: 'Python', compentence: 75 },
                        { name: 'Swift', compentence: 30 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Languages Derivatives</h1>
                    </center>
                    {[
                        { name: 'CSS', compentence: 95 },
                        { name: 'HTML', compentence: 98 },
                        { name: 'JSON', compentence: 100 },
                        { name: 'MarkDown', compentence: 86 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Databases</h1>
                    </center>
                    {[
                        { name: 'MongoDB', compentence: 90 },
                        { name: 'SQLite', compentence: 87 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Version Control</h1>
                    </center>
                    {[
                        { name: 'git', compentence: 80 },
                        { name: 'github', compentence: 89 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Cloud Services</h1>
                    </center>
                    {[
                        { name: 'AWS', compentence: 90 },
                        { name: 'Azure', compentence: 50 },
                        { name: 'Firebase', compentence: 70 },
                        { name: 'Google APIs', compentence: 93 },
                        { name: 'MongoDB Atlas', compentence: 87 },
                        { name: 'NGINX', compentence: 83 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
                </div>
                <div className='flex-catagory'>
                    <center>
                        <h1>Misc.</h1>
                    </center>
                    {[
                        { name: 'Agile Methodology', compentence: 99 },
                    ].map(n => this.mapSkills(n.name, n.compentence))}
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