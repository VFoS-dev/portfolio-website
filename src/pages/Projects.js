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
            <div id="tile" style={compiled} onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
        );
    }

    render() {
        return (<div className="projects">
            <div className='disable' style={{ position: "fixed", top: '10vh', width: '50%', display: 'flex', justifyContent: 'flex-start', left: 0, marginLeft: '30px' }}>
                <div className='cardspot enable pointer' />
            </div>
            <div className='disable' style={{ position: "fixed", top: '10vh', width: '50%', display: 'flex', justifyContent: 'flex-end', right: 0, marginRight: '30px' }}>
                <div className='cardspot enable pointer' />
                <div className='cardspot enable pointer' />
                <div className='cardspot enable pointer' />
                <div className='cardspot enable pointer' />
            </div>
            <div className='navpadding' />
            <center><h1 className='lato-title'>Projects</h1></center>
            <div className='navpadding' />
            <div className='navpadding' />
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
        </div >);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedProjects = connect(mapState, actionCreators)(Projects);
export { connectedProjects as Projects };