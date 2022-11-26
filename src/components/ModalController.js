import React, { Component, Fragment } from 'react';
import { Deadline, Defend, Uno, Default, Survive } from '../modal';

export class ModalController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queue: null,
            update: false
        }
    }

    remove(e) {
        if (e != 'cancel') return
        const { update } = this.state
        var past = window.location.pathname.split('/')
        var sub = `/${past[1]}`
        window.history.replaceState(sub, 'Title', sub)
        this.setState({ queue: past[2] || null, update: !update })
    }

    route(modal) {
        switch (modal) {
            case null:
                return <Fragment />
            case 'survive':
                return <Survive />
            case 'uno_ai':
                return <Uno />
            case 'defend':
                return <Defend />
            case 'deadline':
                return <Deadline />
            default:
                return <Default />
        }
    }
    resetScroll(e, hide) {
        if (hide) e.scroll(0, 0)
    }

    render() {
        const { queue } = this.state;
        var modal = window.location.pathname.split('/')[2] || null

        return <div className={`sticky-overlay _modal ${modal ? "show" : "hide"}`} id='cancel' onClick={(e) => this.remove(e.target.id)} >
            <div className='card' onTransitionEnd={(e) => this.resetScroll(e.target, !modal)}>
                {this.route(modal || queue)}
            </div>
        </div>
    }
}