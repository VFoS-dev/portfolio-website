import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/socials.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: [],
            pathAni: false,
            size: 4,
            options: [
                { name: 'Linkedin', gif: '/images/socials/linkedin.gif', startRot: Math.random() * 360, href: 'https://www.linkedin.com/in/jon-kido-vfos/', hovered: false },
                { name: 'YouTube', gif: '/images/socials/youtube.gif', startRot: Math.random() * 360, href: 'https://www.youtube.com/channel/UCbHIwUTtZwRiiPTyl_3ncLQ/', hovered: false },
                { name: 'LeetCode', gif: '/images/socials/leetcode.gif', startRot: Math.random() * 360, href: 'https://leetcode.com/VFoS/', hovered: false },
                { name: 'Github', gif: '/images/socials/github.gif', startRot: Math.random() * 360, href: 'https://github.com/VFoS-dev', hovered: false }
            ]
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

    openLink(index, clicked = false) {
        const { options } = this.state
        if (clicked) window.open(options[index].href, '_blank');
        else if (!options[index].hovered) {
            options[index].hovered = true;
            setTimeout(() => window.open(options[index].href, '_blank'), 500);
            this.setState({ options: options });
        }
    }

    createOptions(op, index) {
        return <div className='options'>
            <div className='svg'>
                <svg viewBox="0 0 168 168" style={{ '--rot': `${op.startRot}deg` }}>
                    <ellipse id="shape0" transform="matrix(0.927142888710217 0 0 0.932857140571063 6.1199973483418 5.6400001920307)" rx="84" ry="84" cx="84" cy="84" fill="none" stroke="#000000" stroke-width="2.4" stroke-linecap="square" />
                    <circle id="shape0" transform="matrix(0.927142864724638 0 0 0.932857116437654 34.018153730675 33.7101010437258)" r="53.9095409898556" cx="53.9095409898556" cy="53.9095409898556" fill="none" stroke="#000000" stroke-width="2.4" stroke-linecap="square" />
                    <path id="upper" transform="translate(19.7999976778584, 84)" d="M0 -1.26218e-29C-3.33663e-14 22.9365 12.2365 44.1306 32.1 55.5988C51.9636 67.0671 76.4365 67.0671 96.3 55.5988C116.164 44.1306 128.4 22.9365 128.4 1.09118e-13" fill="none" stroke="transparent" stroke-width="2.4" stroke-linecap="square" />
                    <path id="lower" transform="matrix(-0.999980871067792 0.00618381781983816 -0.00618381781983816 -0.999980871067792 148.19877424465 83.6029988816068)" d="M0 1.77501e-13C1.05879e-13 35.4567 28.7433 64.2 64.2 64.2C99.6567 64.2 128.4 35.4567 128.4 2.29597e-13" fill="none" stroke="transparent" stroke-width="2.4" stroke-linecap="square" />
                    <text width="500">
                        <textPath alignment-baseline="middle" href="#upper">
                            {op.name}
                        </textPath>
                    </text>
                    <text width="500">
                        <textPath alignment-baseline="middle" href="#lower">
                            {op.name}
                        </textPath>
                    </text>
                </svg>
            </div>
            <div className='hoverEvent' id={index} onClick={e => this.openLink(e.target.id, true)} onMouseEnter={e => this.openLink(e.target.id)} />
            <img src={op.gif} />
        </div>
    }

    render() {
        const { path, pathAni, options } = this.state
        if (path.length > 0 && !pathAni) this.updateSlash()
        return (<Fragment>
            <canvas id='slash' className='sticky-overlay' />
            <div className='sticky-overlay' />
            <div className="socials" onMouseMove={(e) => this.addVector(e)}>
                <div className='navpadding' />
                <center className='demoSpacing'>
                    <h2>THIS PAGE IS UNDER CONSTRUCTION</h2>
                    {options.map((a, index) => this.createOptions(a, index))}
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