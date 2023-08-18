import React, { Fragment, useRef } from 'react';
import { connect } from 'react-redux';
import { distanceSegmentToPoint } from '../utils/math';
import { timeout } from '../utils';
import '../css/testpage.css';

class TestPage extends React.Component {
    constructor(props) {
        document.getElementById('loading').style = 'display: none;';
        super(props);
        this.state = {
            setup: false,
            tick: false,
            splats: [],
            sliced: [],
            fruits: [
                { id: '123560', type: 'apple', state: 'alive', pos: { top: 100, left: 300, width: 100, height: 100, velX: 7, velY: -50 } },
                { id: '1235610', type: 'apple', state: 'alive', pos: { top: 500, left: 900, width: 100, height: 100, velX: -7, velY: -50 } }
            ],
            prevousSlash: {},
        };
        this.slicedCheck = this.slicedCheck.bind(this);
        this.updateSlice = this.updateSlice.bind(this);
        this.gametick = this.gametick.bind(this);
    }

    saveSlash = (left, top) => this.setState({ prevousSlash: { top, left } });

    async gametick() {
        if (this.state.tick) return;
        const gravity = 3;
        await timeout(0);
        this.setState({ tick: true });
        while (true) {
            await timeout(33);
            if (window.location.pathname.split('/')[1] !== '') return;
            let { fruits, sliced, splats } = this.state;
            for (let [i, fruit] of fruits.entries()) {
                const { top, left, velX, velY } = fruit.pos;
                fruits[i] = {
                    ...fruit, pos: {
                        ...fruit.pos,
                        top: top + velY,
                        left: left + velX,
                        velY: Math.min(42, velY + gravity)
                    }
                };
            }
            for (let [i, slice] of sliced.entries()) {
                const { top, left, velX, velY } = slice.pos;
                sliced[i] = {
                    ...slice, pos: {
                        ...slice.pos,
                        top: top + velY,
                        left: left + velX,
                        velY: Math.min(42, velY + gravity)
                    }
                };
            }
            for (let [i, splat] of splats.reverse().entries()) {
                if (splat.tick <= 1) {
                    splats.splice(i, 1);
                    continue;
                }
                splats[i] = { ...splat, tick: splat.tick - 1 };
            }

            this.setState({ fruits, sliced });
        }
        this.setState({ tick: false });
    }

    slicedCheck(e) {
        const { clientX: x1, clientY: y1 } = e;
        let { prevousSlash, fruits } = this.state;
        const { left: x2, top: y2 } = prevousSlash;
        let update = false;
        let indexes = [];

        for (let [i, fruit] of fruits.entries()) {
            if (fruit.state != 'alive') continue;
            const { left: Cx, top: Cy } = fruit.pos;
            let distance = distanceSegmentToPoint(
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                { x: Cx, y: Cy }
            );
            if (isNaN(distance) || distance > fruit.pos.width / 2) continue;
            indexes.push(i);
            update = true;
            fruit.state = 'splat';
        }

        if (update) {
            let slope = (y1 - y2) / (x1 - x2);
            this.updateSlice(fruits, indexes, slope);
        }

        this.saveSlash(x1, y1);
    }

    updateSlice(fruits, indexes, slope) {
        let rotate = Math.atan(slope) + Math.PI / 2;
        let offsetX = Math.cos(rotate) * 10;
        let offsetY = Math.sin(rotate) * 10;
        let { splats, sliced } = this.state;
        indexes.reverse().forEach(i => {
            let splat = fruits.splice(i, 1)[0]
            let slice1 = { ...splat, id: splat.id + '-r', pos: { ...splat.pos, "--rot": Math.tan(slope), top: splat.pos.top + offsetY, left: splat.pos.left + offsetX, velX: offsetX, velY: offsetY * 2 } };
            let slice2 = { ...splat, id: splat.id + '-l', pos: { ...splat.pos, "--rot": Math.tan(slope), top: splat.pos.top - offsetY, left: splat.pos.left - offsetX, velX: -offsetX, velY: -offsetY * 2 } };
            splats.push({ ...splat, tick: 50 });
            sliced.push(slice1);
            sliced.push(slice2);
        });
        this.setState({ fruits, splats, sliced });
    }

    render() {
        const { tick, fruits, splats, sliced, setup } = this.state;
        if (!setup) document.addEventListener('mousemove', this.slicedCheck);
        if (!tick) this.gametick();

        return (
            <div className="test">
                {fruits.map(f => {
                    return <div key={f.id} className={`fruit ${f.state} ${f.type}`} style={f.pos}></div>
                })}
                {splats.map(f => {
                    return <div key={f.id} className={`splat ${f.type}`} style={f.pos}></div>
                })}
                {sliced.map(f => {
                    return <div key={f.id} className={`sliced ${f.type}`} style={f.pos}></div>
                })}
            </div>
        );
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedTestPage = connect(mapState, actionCreators)(TestPage);
export { connectedTestPage as TestPage };