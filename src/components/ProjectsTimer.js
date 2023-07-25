import React, { Fragment } from 'react';
import { connect } from 'react-redux';

class ProjectTimer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0,
            paused: false,
            reset: false,
            clock: false,
        }
        this.convertCount = this.convertCount.bind(this)
        this.tick = this.tick.bind(this)
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async tick() {
        if (this.state.clock || this.state.count > 999) return
        this.setState({ clock: true })
        while (!this.state.paused && this.state.count < 999) {
            await this.timeout(1000)
            if (window.location.pathname.substring(0, 9) !== '/projects' || this.state.paused) break;
            const { count } = this.state;
            this.setState({ count: count + 1 })
        }
        this.setState({ clock: false })
    }

    convertCount() {
        const { count } = this.state;
        let list = [0, 0, 0];
        if (count < 999)
            [...`${count}`].forEach((char, i, str) => {
                list[i + (3 - str.length)] = char
            })
        else list = [9, 9, 9]

        return list
    }

    render() {
        const { reset, paused } = this.props;
        const { reset: r, paused: p, cantick } = this.state;
        if (reset != r) this.setState({ count: 0, reset })
        if (paused != p) this.setState({ paused })
        if (!paused) this.tick()

        const [hundredths, tenths, firsts] = this.convertCount()
        return (<Fragment>
            <div className={`numb n${hundredths}`} />
            <div className={`numb n${tenths}`} />
            <div className={`numb n${firsts}`} />
        </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedProjectTimer = connect(mapState, actionCreators)(ProjectTimer);
export { connectedProjectTimer as ProjectTimer };