import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { timeout } from '../utils';
import { socialsData, social_Data } from '../_data';

import '../css/socials.css';

class Socials extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            path: [],
            pathAni: false,
            size: 4,
        }

        this.addVector = this.addVector.bind(this);

        const { activePage } = this.props;
        if (activePage) {
            document.onmousemove = this.addVector
        }
    }

    componentWillUnmount = () => document.onmousemove = null;

    async updateSlash() {
        await timeout(0);
        if (window.location.pathname.split('/')[1] !== 'socials') return;
        this.setState({ pathAni: true });
        while (this.state.path.length > 0) {
            await timeout(20);
            if (window.location.pathname.split('/')[1] !== 'socials') return;
            const { path } = this.state;
            var p = [...path];
            p.pop();
            if (p.length) this.updatePath(p);
        }
        this.setState({ pathAni: false });
    }

    addVector(e) {
        if (window.location.pathname.split('/')[1] !== 'socials') return;
        const { path } = this.state;
        var _p = path;
        if (_p.length > 10) _p.pop();
        var p = [{
            x: e.pageX,
            y: e.pageY
        }, ..._p];
        this.updatePath(p);
    }

    updatePath(path) {
        if (window.location.pathname.split('/')[1] !== 'socials') return;
        const { size } = this.state;
        const colors = [
            '#4d4d4d',
            "#6e6e6e",
            "#969696",
            "#ffffff",
        ];

        var vectors = path;
        const { clientWidth, clientHeight } = document.documentElement;

        var canvas = document.getElementById("slash");
        canvas.width = clientWidth;
        canvas.height = clientHeight;
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

        _Vectors.reverse();

        colors.forEach((color, index) => {
            context.strokeStyle = color;
            context.lineCap = "round";

            _Vectors.forEach((set, vIndex, sets) => {
                context.beginPath();
                context.lineTo(set.x, set.y);
                if (vIndex) context.lineTo(sets[vIndex - 1].x, sets[vIndex - 1].y);
                context.lineWidth = (size + 10 * (colors.length - index) / colors.length) * 2 * (vIndex + 1) / _Vectors.length;
                context.stroke();
            });
        });
        this.setState({ path: path });
    }

    openLink(index) {
        const { href } = social_Data[index];
        switch (href) {
            case 'game-start': return console.log('create game!');
            default: return window.open(href, '_blank');
        }
    }

    createOptions({ name, gif, href, ring, shadow, upper, lower }, index) {
        return <div key={`option-${name}`} className='option' style={{ backgroundImage: `url(${shadow})` }}>
            <div className='option-group'>
                <div className='circle'>
                    <svg className='text' viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
                        <path id="upper" fill="none" transform="translate(19.7999976778584, 84) scale(1,-1)"
                            d="M0 -1.26218e-29C-3.33663e-14 22.9365 12.2365 44.1306 32.1 55.5988C51.9636 67.0671 76.4365 67.0671 96.3 55.5988C116.164 44.1306 128.4 22.9365 128.4 1.09118e-13" />
                        <path id="lower" fill="none"
                            transform="matrix(-0.999980871067792 0.00618381781983816 -0.00618381781983816 -0.999980871067792 148.19877424465 83.6029988816068)  scale(1,-1)"
                            d="M0 1.77501e-13C1.05879e-13 35.4567 28.7433 64.2 64.2 64.2C99.6567 64.2 128.4 35.4567 128.4 2.29597e-13" />
                        <text className="fnFont" alignmentBaseline="top">
                            <textPath href="#upper" {...upper}>{name}</textPath>
                            <textPath href="#lower" {...lower}>{name}</textPath>
                        </text>
                    </svg>
                    <img className='decor' src={ring} />
                </div>
                <img className='gif' src={gif} id={index} onClick={(e) => this.openLink(e.target.id)} />
            </div>
        </div>
    }

    render() {
        const { path, pathAni } = this.state;
        const { activePage } = this.props;

        if (activePage && path.length > 0 && !pathAni)
            this.updateSlash()

        return (<Fragment>
            <canvas id='slash' className='sticky-overlay' />
            <div className="socials">
                <div className='navpadding' />
                <div className='links'>
                    {socialsData([]).map((a, index) => this.createOptions(a, index))}
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