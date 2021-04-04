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

    render() {
        return (<div className="projects">
            <h1>Projects</h1>
            This Website is still a work in progress
            <div className="tile-container">
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} />
                <div id="tile" onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} onClick={() => document.getElementsByClassName('face focus')[0].scrollTo({ bottom: 50 })} />
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