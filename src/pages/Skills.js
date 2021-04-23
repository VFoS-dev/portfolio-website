import React from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';

class Skills extends React.Component {
    mapSkills(name, perc) {
        return (<>
            <div className='segment'>
                <h3 className='title'>{name}</h3>
                <h6 className='percent'>{perc}%</h6>
                <div className='barContainer'>
                    <div className='bar' style={{ width: `${perc}%` }} />
                </div>
            </div>
        </>);
    }

    render() {
        var lookupTable = [

        ];
        return (<div className="skills">
            {this.mapSkills('Adobe Animate', 95)}
            {this.mapSkills('AutoHotKey (AHK)', 75)}
            {this.mapSkills('ActionScript 3 (AS3)', 90)}
            {this.mapSkills('AWS', 80)}
            {this.mapSkills('Azure', 60)}
            {this.mapSkills('C++', 65)}
            {this.mapSkills('C#', 95)}
            {this.mapSkills('CSS', 95)}
            {this.mapSkills('Express.js', 80)}
            {this.mapSkills('Firebase', 87)}
            {this.mapSkills('git', 80)}
            {this.mapSkills('HTML', 98)}
            {this.mapSkills('Ionic', 70)}
            {this.mapSkills('Javascript', 98)}
            {this.mapSkills('MongoDB', 87)}
            {this.mapSkills('.Net', 72)}
            {this.mapSkills('Node.js', 80)}
            {this.mapSkills('Python', 80)}
            {this.mapSkills('React', 87)}
            {this.mapSkills('Unity', 90)}
            {this.mapSkills('Unreal', 50)}
        </div>);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedSkills = connect(mapState, actionCreators)(Skills);
export { connectedSkills as Skills };