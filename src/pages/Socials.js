import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { timeout } from '../utils';

import '../css/socials.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: [],
            pathAni: false,
            size: 4,
            options: [
                {
                    name: 'Coming Soon',
                    gif: '/images/socials//game/pineapple.gif',
                    startRot: Math.random() * 360,
                    styles: {
                        outerLine: 'white',
                        innerLine: 'white',
                        textBorder: 'black',
                        textColor: 'white'
                    }
                },
                {
                    id: '',
                    name: 'Github',
                    gif: '/images/socials/github.gif',
                    startRot: Math.random() * 360,
                    href: 'https://github.com/VFoS-dev',
                    styles: {
                        foreignShadow: <foreignObject x="2" y="2" width="164" height="164" mask="url(#donut)">
                            <div className="rainbowGradient" />
                        </foreignObject>,
                        foreign: <foreignObject x="2" y="2" width="164" height="164" mask="url(#donut)">
                            <div className="rainbowGradient" />
                        </foreignObject>,
                        outerLine: 'white',
                        innerLine: 'white',
                        textBorder: 'black',
                        textColor: 'white'
                    }
                },
                {
                    id: 'pattern1',
                    name: 'Linkedin',
                    gif: '/images/socials/linkedin.gif',
                    startRot: Math.random() * 360,
                    href: 'https://www.linkedin.com/in/jon-kido-vfos/',
                    styles: {
                        fill: <linearGradient
                            id="pattern1"
                            gradientTransform="rotate(30)">
                            <stop offset="0%" stopColor="rgba(255,0,0,0.5)" />
                            <stop offset="20%" stopColor="rgba(255,0,0,0.5)" />
                            <stop offset="95%" stopColor="rgba(0,0,255,0.5)" />
                            <stop offset="100%" stopColor="rgba(0,0,255,0.5)" />
                        </linearGradient>,
                        outerLine: '#4b61db',
                        innerLine: '#db4b4b',
                        text: {
                            upperBorder: '#700000',
                            upperColor: 'yellow',
                            lowerBorder: '#002d8f',
                            lowerColor: '#dce6fc',
                        }
                    }
                },
                {
                    id: 'pattern3',
                    name: 'YouTube',
                    gif: '/images/socials/youtube.gif',
                    startRot: Math.random() * 360,
                    href: 'https://www.youtube.com/channel/UCbHIwUTtZwRiiPTyl_3ncLQ/',
                    styles: {
                        fill: <pattern id="pattern3" width="25" height="1" patternUnits="userSpaceOnUse" patternTransform="rotate(45 50 50)">
                            <rect fill='rgba(0, 86, 255, 0.5)' width='25px' height='10px' />
                            <line stroke='rgba(61, 127, 255, 0.5)' strokeWidth="25px" y2="10" />
                        </pattern>,
                        outerLine: '#3469d1',
                        innerLine: '#3469d1',
                        textBorder: '#002d8f',
                        textColor: '#dce6fc'
                    }
                },
                {
                    id: '',
                    name: 'LeetCode',
                    gif: '/images/socials/leetcode.gif',
                    startRot: Math.random() * 360,
                    href: 'https://leetcode.com/VFoS/',
                    styles: {
                        foreign: <foreignObject x="2" y="2" width="164" height="164" mask="url(#donut)">
                            <div className="gradient" />
                        </foreignObject>,
                        outerLine: 'rgba(255,100,100,0.5)',
                        innerLine: 'rgba(255,100,100,0.5)',
                        textBorder: '#700000',
                        textColor: 'yellow'
                    }
                },
            ]
        }

        this.addVector = this.addVector.bind(this);
        this.updateSlash = this.updateSlash.bind(this);
    }

    async updateSlash() {
        this.setState({ pathAni: true })
        while (this.state.path.length > 0) {
            await timeout(20)
            if (window.location.pathname !== '/socials') break;
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
        if (window.location.pathname !== '/socials') return;
        this.updatePath(p)
    }

    updatePath(path) {
        if (window.location.pathname !== '/socials') return
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
                if (vIndex) context.lineTo(sets[vIndex - 1].x, sets[vIndex - 1].y);
                context.lineWidth = (size + 10 * (colors.length - index) / colors.length) * 2 * (vIndex + 1) / _Vectors.length
                context.stroke();
            });
        });
        this.setState({ path: path })
    }

    openLink(index) {
        const { options } = this.state
        window.open(options[index].href, '_blank')
    }

    createOptions(op, index) {
        return <div className='grow' key={'options' + index}>
            <div className='options'>
                <div className='svg'>
                    <svg className='shadow' viewBox="0 0 168 168" filter='blur(2.5em)'>
                        <circle mask="url(#donut)" fill='rgba(10,10,10,1)' r="82" cx="84" cy="84" />
                        {op.styles.foreignShadow}
                    </svg>
                    <svg className='rot' viewBox="0 0 168 168" style={{ '--rot': `${op.startRot}deg` }}>
                        <defs>{op.styles.fill}</defs>
                        {op.styles.foreign}
                        <circle id="visual" mask="url(#donut)" fill={`url(#${op.id})`} stroke={op.styles.outerLine} strokeWidth="1.4" r="82" cx="84" cy="84" />
                        <circle fill='none' stroke={op.styles.innerLine} strokeWidth="1.4" transform="matrix(1 0 0 1 28 28)" r="55.9095409898556" cx="55.9095409898556" cy="55.9095409898556" />
                        <path id="upper" fill="none" transform="translate(19.7999976778584, 84) scale(1,-1)" d="M0 -1.26218e-29C-3.33663e-14 22.9365 12.2365 44.1306 32.1 55.5988C51.9636 67.0671 76.4365 67.0671 96.3 55.5988C116.164 44.1306 128.4 22.9365 128.4 1.09118e-13" />
                        <path id="lower" fill="none" transform="matrix(-0.999980871067792 0.00618381781983816 -0.00618381781983816 -0.999980871067792 148.19877424465 83.6029988816068)  scale(1,-1)" d="M0 1.77501e-13C1.05879e-13 35.4567 28.7433 64.2 64.2 64.2C99.6567 64.2 128.4 35.4567 128.4 2.29597e-13" />
                        <mask id='donut'>
                            <rect fill='white' width='168px' height='168px' />
                            <circle fill='black' transform="matrix(1 0 0 1 28 28)" r="55.9095409898556" cx="55.9095409898556" cy="55.9095409898556" />
                        </mask>
                        <text className='fnFont' alignmentBaseline="top">
                            <textPath href="#upper" fill={op.styles.textColor || op.styles.text.upperColor} stroke={op.styles.textBorder || op.styles.text.upperBorder}>{op.name}</textPath>
                            <textPath href="#lower" fill={op.styles.textColor || op.styles.text.lowerColor} stroke={op.styles.textBorder || op.styles.text.lowerBorder}>{op.name}</textPath>
                        </text>
                    </svg>
                </div>
                {op.href && <div className='hoverEvent' id={index} onClick={e => this.openLink(e.target.id, true)} />}
                {op.gif && <img className='gif' src={op.gif} alt=''/>}
            </div>
        </div>
    }

    render() {
        const { path, pathAni, options } = this.state
        if (path.length > 0 && !pathAni) setTimeout(() => this.updateSlash(), 0)
        return (<Fragment>
            <canvas id='slash' className='sticky-overlay' />
            <div className="socials" onMouseMove={(e) => this.addVector(e)}>
                <div className='navpadding' />
                <div className='links'>
                    {options.map((a, index) => this.createOptions(a, index))}
                </div>
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