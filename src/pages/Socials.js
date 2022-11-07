import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/pages.css';
import '../css/socials.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: [],
            pathAni: false,
            size: 4
        }
        this.addVector = this.addVector.bind(this);
        this.updateSlash = this.updateSlash.bind(this);
    }

    async updateSlash() {
        this.setState({ pathAni: true })
        while (this.state.path.length > 0) {
            await this.timeout(20)
            if (window.location.pathname != '/socials') break;
            const { path } = this.state;
            var p = [...path];
            p.pop()
            if (p.length) this.updatePath(p)
        }
        this.setState({ pathAni: false })
    }

    addVector(e) {
        const { path } = this.state
        var _p = path
        if (_p.length > 10) _p.pop()
        var p = [{
            x: e.pageX,
            y: e.pageY
        }, ..._p]
        this.updatePath(p)
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updatePath(path) {
        if (window.location.pathname != '/socials') return
        const { size } = this.state
        const colors = [
            '#4d4d4d',
            "#6e6e6e",
            "#969696",
            "#ffffff",
        ];

        var particles = path
        const { clientWidth, clientHeight } = document.documentElement

        var canvas = document.getElementById("slash");
        canvas.width = clientWidth
        canvas.height = clientHeight
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, clientWidth, clientHeight);
        context.lineJoin = "round";

        let particleSets = [];

        let x = path[0].x, y = path[0].y;

        particles.forEach(function (particle, index, particles) {
            let nextParticle = particles[index + 1] || particles[0];

            particle.x = x;
            particle.y = y;

            particleSets.push({ x: x, y: y });

            x += (nextParticle.x - particle.x) * 0.6;
            y += (nextParticle.y - particle.y) * 0.6;
        });

        particleSets.reverse()

        colors.forEach((color, index) => {
            context.strokeStyle = color;
            context.lineCap = "round";

            particleSets.forEach((set, particleIndex, sets) => {
                context.beginPath();

                context.lineTo(set.x, set.y);
                if (particleIndex) {
                    context.lineTo(sets[particleIndex - 1].x, sets[particleIndex - 1].y);
                }

                context.lineWidth = (size + 10 * (colors.length - index) / colors.length) * 2 * (particleIndex + 1) / particleSets.length

                context.stroke();
            });
        });
        this.setState({ path: path })
    }

    render() {
        const { path, pathAni } = this.state
        if (path.length > 0 && !pathAni) this.updateSlash()
        return (<Fragment>
            <canvas id='slash' className='sticky-overlay' />
            <div className="socials" onMouseMove={(e) => this.addVector(e)}>
                <div className='navpadding' />
                <center className='demoSpacing'>
                    <h2>THIS PAGE IS UNDER CONSTRUCTION</h2>
                </center>
            </div>
        </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedSocials = connect(mapState, actionCreators)(Socials);
export { connectedSocials as Socials };