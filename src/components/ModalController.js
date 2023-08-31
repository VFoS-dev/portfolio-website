import React, { Component, Fragment } from 'react';
import { ProjectModal } from '../modal';
import { checkAchievement } from '../_actions/user.actions';
import { connect } from 'react-redux';
import { projectData } from '../_data';

class ModalController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queue: null,
            update: false
        };
    }

    remove(e) {
        if (e !== 'cancel') return;
        const { update } = this.state;
        const [, page, secret = null] = window.location.pathname.split('/');
        var sub = `/${page}`;
        window.history.replaceState(sub, 'Title', sub);
        this.setState({ queue: secret || null, update: !update });
    }

    route(modal) {
        if (!modal) return <Fragment />;

        if (projectData[modal]) return <ProjectModal focus={modal} />;

        console.error('ERROR: Modal was not found:', modal);

        return <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
            Content for this project has not yet been created.
        </center>;
    }

    resetScroll = (e, hide) => (hide) ? e.scroll(0, 0) : null;

    render() {
        const { queue } = this.state;
        const [, , modal] = window.location.pathname.split('/')
        if (modal == 'secret') return <Fragment></Fragment>;

        if (modal) {
            this.props.checkAchievement('projectStart')
            this.props.checkAchievement('projectAll', modal)
        }

        return <div className={`sticky-overlay _modal ${modal ? "show" : "hide"}`} id='cancel' onClick={(e) => this.remove(e.target.id)} >
            <div className='card' onTransitionEnd={(e) => this.resetScroll(e.target, !modal)}>
                <div style={{ position: 'absolute', top: 0, right: 0 }} className='pointer' id='cancel' onClick={(e) => this.remove(e.target.id)}>
                    <svg className='disable' stroke="black" fill="black" strokeWidth="0" viewBox="0 0 1024 1024" height="3em" xmlns="http://www.w3.org/2000/svg"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg>
                </div>
                {this.route(modal || queue)}
            </div>
        </div>
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {
    checkAchievement
};

const connectedModalController = connect(mapState, actionCreators)(ModalController);
export { connectedModalController as ModalController };