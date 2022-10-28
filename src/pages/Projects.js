import React from 'react';
import { connect } from 'react-redux';

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
                {this.mapTile('', '', '/images/projects/abcStories.png', '10%')}
                {this.mapTile('', '', '/images/projects/PD-v1.7.png')}
                {this.mapTile('', '', '/images/projects/deadline.png')}
                {this.mapTile('', '', '/images/projects/defend.png')}
                {this.mapTile('', '', '/images/projects/minesweeper.png')}
                {this.mapTile('', '', '/images/projects/survive.png')}
                {this.mapTile('', '', '/images/projects/swordwhip.png')}
                {this.mapTile('', '', '/images/projects/uno.png')}
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