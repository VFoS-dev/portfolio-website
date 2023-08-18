import React, { Fragment, createRef } from 'react';
import { connect } from 'react-redux';
import { skillData } from '../_data/SkillsData';

import '../css/skills.css';
import '../css/stars.css';

class Skills extends React.Component {
    constructor(props) {
        super(props)
        let skillCount = skillData.length;

        this.state = {
            scrolled: "-1",
            updatedRefs: false,
            onScreen: new Array(skillCount).fill(false),
            filters: new Array(skillCount).fill(true),
        }

        skillData.forEach((_, i) => {
            this[`ref${i}`] = createRef();
        })
        this.generateSkills = this.generateSkills.bind(this);
    }

    userScrolled() {
        const f = document.getElementById("focused");
        this.setState({
            scrolled: this.props.scrolled,
            updatedRefs: true,
            onScreen: skillData.map((_, i) => {
                const { current: c } = this[`ref${i}`]
                return (f?.scrollTop + document.documentElement.clientHeight > c?.offsetTop + document.documentElement.clientHeight * 1 / 5) || (f?.scrollTop + document.documentElement.clientHeight > f?.scrollHeight - 100);
            })
        })
    }

    mapSkills(title, entries, refIndex, color, textColor = null) {
        const { onScreen } = this.state;
        const sorted = JSON.parse(`{${JSON.parse(JSON.stringify(entries)).sort((a, b) => b.compentence - a.compentence).map((a, index) => `"${a.name}":${index}`).join(',')}}`);
        return <Fragment>
            <div style={{ width: "100%", height: "100%", overflow: 'hidden', position: "absolute", zIndex: 0, borderRadius: "30px", pointerEvents: 'none' }}>
                <div id='stars' />
                <div id='stars2' />
                <div id='stars3' />
            </div>
            <center>
                <h1 style={{
                    paddingTop: '18px', ...(color || textColor ? { color: textColor || color } : {})
                }}>{title}</h1>
            </center>
            <div style={{
                zIndex: 2,
                margin: '18px',
                height: `calc(60px * ${entries.length})`,
                position: 'relative'
            }}>
                {entries.map((n, index) => (
                    <div key={n.name} className='segment' style={{ '--base-height': `${60 * index}px`, '--sorted-height': `${60 * sorted[n.name]}px` }}>
                        <h3 className='title relative' style={color || textColor ? { color: textColor || color } : {}}>{n.name}
                            {!!n.linkedin && <div className='linkedinApproved'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-supported-dps="24x24" fill="#0a66c2" className="mercado-match" height="100%" focusable="false">
                                    <path d="M14.73 10H17l-5.5 8L8 14.5l1.34-1.34L11.21 15zM20 3v16a3 3 0 01-3 3H7a3 3 0 01-3-3V3h5.69l.52-1A2 2 0 0112 1a2 2 0 011.76 1l.52 1zm-2 2h-2.6l.6 1.1V7H8v-.9L8.6 5H6v14a1 1 0 001 1h10a1 1 0 001-1z"></path>
                                </svg>
                                <div className='topPercent'>
                                    top: {n.linkedin}%
                                </div>
                            </div >}
                            <div className='percent' style={color || textColor ? { color: textColor || color } : {}}>{n.compentence}%</div>
                        </h3>
                        <div className="progress" style={{ backgroundColor: "none" }} >
                            <img className='hilt' src="/images/skills/hilt.png" style={{ zIndex: 1 }} alt='' />
                            <div className="progress-bar clear" style={{ width: `calc(${n.compentence}% - 90px)` }}>
                                <div className={`light${onScreen[refIndex] ? ' in' : ''}`}
                                    style={color ? {
                                        boxShadow: `0 0 5px #fff, 0 0 12px #fff, 0 0 15px ${color}, 0 0 35px ${color}`,
                                        width: `${onScreen[refIndex] * 100}%`
                                    } : {}} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Fragment >
    }

    generateSkills(data, activePage) {
        const { filters } = this.state;
        return data.map((d, i) => {
            if (!activePage && i > 4) return '';
            const { name, set, color, textColor } = d;
            return <div key={`skills-cat${i}`} className={`flex-catagory ${filters[i] || 'filtered'}`} ref={this[`ref${i}`]} style={{ boxShadow: `0 0 5px #fff, 0 0 15px ${color}`, position: "relative" }}>
                <div className='skills-filter' id={i} onClick={(e) => this.filter(e.target.id)}>
                    <svg stroke={`${color}`} fill={`${color}`} strokeWidth="0" viewBox="0 0 16 16" width="100%" xmlns="http://www.w3.org/2000/svg"><path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"></path></svg>
                </div>
                {this.mapSkills(name, set, i, color, textColor)}
            </div>
        })
    }

    filter(index) {
        const { filters } = this.state;
        filters[index] = !filters[index];
        this.setState({ filters: filters });
    }

    render() {
        const { activePage } = this.props;
        if (activePage) {
            if (this.props.scrolled !== this.state.scrolled) setTimeout(() => this.userScrolled(), 0);
            if (!this.state.updatedRefs) setTimeout(() => this.userScrolled(), 0);
        }

        return (<div className="skills">
            <div className='navpadding' />
            <div className='flex-container'>
                {this.generateSkills(skillData, activePage)}
            </div>
        </div>);
    }
}

function mapState(state) {
    return {};
}
const actionCreators = {};

const connectedSkills = connect(mapState, actionCreators)(Skills);
export { connectedSkills as Skills };