import React, { Fragment } from 'react';
import { connect } from 'react-redux';

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

        var vectors = path
        const { clientWidth, clientHeight } = document.documentElement

        var canvas = document.getElementById("slash");
        canvas.width = clientWidth
        canvas.height = clientHeight
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, clientWidth, clientHeight);
        context.lineJoin = "round";

        let _Vectors = [];

        let x = path[0].x, y = path[0].y;

        vectors.forEach(function (v, index) {
            let nVectors = vectors[index + 1] || vectors[0];

            v.x = x;
            v.y = y;

            _Vectors.push({ x: x, y: y });

            x += (nVectors.x - v.x) * 0.6;
            y += (nVectors.y - v.y) * 0.6;
        });

        _Vectors.reverse()

        colors.forEach((color, index) => {
            context.strokeStyle = color;
            context.lineCap = "round";

            _Vectors.forEach((set, vIndex, sets) => {
                context.beginPath();

                context.lineTo(set.x, set.y);
                if (vIndex) {
                    context.lineTo(sets[vIndex - 1].x, sets[vIndex - 1].y);
                }

                context.lineWidth = (size + 10 * (colors.length - index) / colors.length) * 2 * (vIndex + 1) / _Vectors.length

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
            <div className='sticky-overlay' />
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