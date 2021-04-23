import React from 'react';
import { connect } from 'react-redux';

// photos
import abcStories from '../pictures/abcStories.png';
import deadline from '../pictures/deadline.png';
import defend from '../pictures/defend.png';
import mine from '../pictures/minesweeper.png';
import PD from '../pictures/PD-v1.7.png';
import survive from '../pictures/survive.png';
import swordwhip from '../pictures/swordwhip.png';
import uno from '../pictures/uno.png';

import '../css/pages.css';
import '../css/tile.css';


class Projects extends React.Component {
    handleMove(e) {
        var el = e.target;

        const height = el.clientHeight;
        const width = el.clientWidth;

        const yRotation = 20 * ((e.nativeEvent.layerX - width / 2) / width)
        const xRotation = -20 * ((e.nativeEvent.layerY - height / 2) / height)

        el.style.transform = `perspective(500px) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }

    handleMoveOut(e) {
        e.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
    }

    mapTile(name = '', description = '', img, radius = '0%', imgcss = {}) {
        var compiled = {
            'border-radius': radius,
            'background-image': `url(${img})`
        };
        if (imgcss != {}) Object.assign(compiled, imgcss);

        return (
            <div id="tile" style={compiled} onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} >

            </div>
        );
    }

    render() {
        return (<div className="projects">
            <h1>Projects</h1>
            <p>filter and cards of what they are about coming soon</p>
            <div className="tile-container">
                {this.mapTile('', '', abcStories, '10%')}
                {this.mapTile('', '', PD)}
                {this.mapTile('', '', deadline)}
                {this.mapTile('', '', defend)}
                {this.mapTile('', '', mine)}
                {this.mapTile('', '', survive)}
                {this.mapTile('', '', swordwhip)}
                {this.mapTile('', '', uno)}
            </div>
        </div>);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedProjects = connect(mapState, actionCreators)(Projects);
export { connectedProjects as Projects };