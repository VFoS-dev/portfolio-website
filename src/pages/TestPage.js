import React, { Fragment, useRef } from 'react';
import { connect } from 'react-redux';
import { distanceSegmentToPoint } from '../utils/math'
import '../css/testpage.css';

class TestPage extends React.Component {
    constructor(props) {
        document.getElementById('loading').style = 'display: none;'
        super(props)
        this.state = {
            setup: false,
            fruits: [
                {
                    id: '123560',
                    type: 'apple',
                    state: 'alive',
                    pos: {
                        top: 100,
                        left: 300,
                        width: 100,
                        height: 100,
                    }
                },
                {
                    id: '1235610',
                    type: 'apple',
                    state: 'alive',
                    pos: {
                        top: 500,
                        left: 900,
                        width: 100,
                        height: 100,
                    }
                }
            ],
            prevousSlash: {},
        }
        this.slicedCheck = this.slicedCheck.bind(this);
    }

    saveSlash(left, top) {
        this.setState({ prevousSlash: { top, left } })
    }

    slicedCheck(e) {
        const { clientX: x1, clientY: y1 } = e
        let { prevousSlash, fruits } = this.state;
        const { left: x2, top: y2 } = prevousSlash;
        let update = false;
        for (let [i, fruit] of fruits.entries()) {
            console.log(i, fruit);
            if (fruit.state != 'alive') continue;
            const { left: Cx, top: Cy } = fruit.pos
            let distance = distanceSegmentToPoint(
                { x: x1, y: y1 },
                { x: x2, y: y2 },
                { x: Cx, y: Cy }
            )
            if (isNaN(distance) || distance > fruit.pos.width / 2) continue;
            update = true;
            fruit.state = 'splat';
        }

        if (update) this.setState({ fruits });

        this.saveSlash(x1, y1)
    }

    render() {
        const { fruits, setup } = this.state;
        if (!setup) document.addEventListener('mousemove', this.slicedCheck)
        return (
            <div className="test">
                {fruits.map(f => {
                    return <div key={f.id} className={`fruit ${f.state} ${f.type}`} style={f.pos}></div>
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