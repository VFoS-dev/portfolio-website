import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ModalController } from '../components/ModalController';

import '../css/projects.css';
import { ProjectTimer } from '../components';

class Projects extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gamepaused: false,
            gamerestart: false,
            toMine: false,
            updateModal: false,
            minesweeper: false,
            cells: [],
            nbombs: 0,
            flags: 0,
            gameStatus: 0,
            rows: 10,
            refresh: false,
            projects: [
                { title: 'Project Kuro', date: "Jan 1, 2023 - Present", createdIn: 'Unreal Engine 5', img: '/images/projects/projectkuro.png' },
                { title: 'Portfolio Website', date: "Oct 26, '22 - Present", createdIn: 'React', img: '/images/projects/portfolioSite.png' },
                { title: 'Matraex Inc.', date: "Jan 17 - Aug 11, 2023", createdIn: 'PHP / SQL / JQuery / React', img: '/images/worklogos/Matraex.png', imgcss: { backgroundColor: 'white', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' } },
                { title: 'Venture Title', date: "May 3 - Aug 11, 2023", createdIn: 'PHP / SQL / JQuery', img: '/images/projects/ventureidaho.png' },
                { title: 'H.B.V.', date: "Aug 1 - Aug 7, 2023", createdIn: 'PHP / SQL', img: '/images/projects/hbv.png' },
                { title: 'High Call Rodeo', date: "Jul 14 - Jul 31, 2023", createdIn: 'React / Meteor / Mongodb', img: '/images/projects/highcall.jpg', imgcss: { borderRadius: '10%' } },
                { title: 'Salestrak', date: "Jan 26 - Jul 31, 2023", createdIn: 'PHP / SQL / JQuery', img: '/images/projects/salestrak.jpg' },
                { title: 'Rio Genesis', date: "Jun 19 - Jul 17, 2023", createdIn: 'PHP / SQL / React', img: '/images/projects/riogenesis.png' },
                { title: 'Black Sage Tech', date: "Jan 17 - Feb 28, 2023", createdIn: 'React', img: '/images/projects/blacksage.jpg' },
                { title: 'MotorPool Services', date: "Aug 25, '22 - Jan 13, '23", createdIn: 'React', img: '/images/projects/motorpool.png' },
                { title: 'Bronco Beam', date: "Dec 21, '20 - Jul 30, '22", createdIn: 'React Native / Mongodb', img: '/images/projects/BroncoBeam.png', imgcss: { borderRadius: '10%' } },
                { title: 'All in Favor', date: "Sept 4, '21 - Jan 6, '22", createdIn: 'React', img: '/images/projects/AllinFavor.png', imgcss: { borderRadius: '100%', borderBottomLeftRadius: '0%' } },
                { title: 'The Simple Ring Alpha', date: "Oct 8, '20 - Dec 24, '21", createdIn: 'React / Unity / Firebase', img: '/images/projects/TheSimpleRing.png' },
                { title: 'Planet Destroyer', date: "Dec 5, '20 - Apr 15, '21", createdIn: 'Unity VR', img: '/images/projects/PD-v1.7.png' },
                { title: 'ABC Stories', date: "Apr 12 - Dec 23, 2020", createdIn: 'Swift / React', img: '/images/projects/abcStories.png', imgcss: { borderRadius: '10%' } },
                { title: 'Minesweeper Solver', date: "Nov 1 - Dec 4, 2020", createdIn: 'Unity', img: '/images/projects/minesweeper.png' },
                { title: "Cash n' Slash", date: "Sep 14 - Nov 17, 2020", createdIn: 'Unity VR', img: '/images/projects/CashnSlash.png' },
                { title: 'Swordwhip', date: "Sep 15 - 16, 2020", createdIn: 'Unity', img: '/images/projects/swordwhip.png' },
                { title: 'Deadline', date: "Sept 6 - 13, 2018", createdIn: 'Flash', img: '/images/projects/deadline.png' },
                { title: 'Defend', date: "Aug 3 - 18, 2018", createdIn: 'Flash', img: '/images/projects/defend.png' },
                { title: 'UNO AI', date: "Nov 21 - Dec 10, 2017", createdIn: 'Flash', img: '/images/projects/uno.png' },
                { title: 'Survive', date: "Sep 18 - Oct 31, 2017", createdIn: 'Flash', img: '/images/projects/survive.png' },
                { title: 'Original Logo Animation', date: "June 13, 2015", createdIn: 'Blender', img: '/images/projects/OriginalLogoAnimation.png' },
            ]
        };

        this.handleMove = this.handleMove.bind(this);
        this.checkWin = this.checkWin.bind(this);
        this.resize = this.resize.bind(this);

        const { activePage } = this.props;
        if (activePage) {
            window.addEventListener('resize', this.resize);
        }
    }

    resize(e) {
        const { refresh, minesweeper } = this.state;
        if (!minesweeper) this.setState({ refresh: !refresh });
    }

    handleMove(e) {
        var el = e.target;
        if (!el) return;

        if (this.state.toMine) {
            return el.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
        }
        const height = el.clientHeight;
        const width = el.clientWidth;

        const yRotation = 20 * ((e.nativeEvent.layerX - width / 2) / width);
        const xRotation = -20 * ((e.nativeEvent.layerY - height / 2) / height);

        el.style.transform = `perspective(500px) scale(1.1) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }

    handleMoveOut(e) {
        if (!e.style.transform) return;
        e.style.transform = 'perspective(500px) scale(1) rotateX(0) rotateY(0)';
    }

    modalShow(title) {
        const { updateModal } = this.state;
        var sub = `/${window.location.pathname.split('/')[1]}/${title.toLowerCase()}`;
        window.history.replaceState(sub, 'Title', sub);
        this.setState({ updateModal: !updateModal });
    }

    mapTile({ title = '', date = '', createdIn = '', img = "", imgcss = {} }, index) {
        const { toMine, rows } = this.state;
        return (
            <div key={index + "tile"} id={title.replace(/[^a-zA-Z ]/g, "").split(' ').join('_')} className='tile' style={{ backgroundImage: `url(${img})`, ...imgcss, ...(toMine ? { boxShadow: 'none', cursor: 'auto' } : {}) }} onMouseMove={this.handleMove} onMouseOut={(e) => this.handleMoveOut(e.target)} onClick={(e) => this.modalShow(e.target.id)}>
                <div className={` ${toMine ? 'toMinesweeper' : 'overlay'}`} style={{ backgroundImage: `url(/images/projects/minesweeper/toMinesweeper.png)` }} onAnimationEnd={() => this.setState({
                    minesweeper: true,
                    cells: [...new Array(rows)].map(n => [...new Array(rows)])
                })} />
                <div className='tile-title'>{title}</div>
                <div className='tile-date'>{date}</div>
                <div className='tile-createdIn'>{createdIn}</div>
                <div className='tile-decal'></div>
            </div>
        );
    }

    async checkWin() {
        const { cells } = this.state;

        var lost = false, win = 0;
        cells.forEach(_ => _.forEach(c => {
            if (lost) return;
            if (c.value < 0 && c.revealed) lost = true;
            if ((c.value >= 0 && c.revealed) || (c.value < 0 && c.flagged)) win++;
        }))
        win = win === cells.length * cells.length;

        if (win || lost) this.setState({ gameStatus: +win || -1, gamepaused: !!(+win || -1), });
    }

    createGame(index) {
        const { cells, projects } = this.state;
        let _c = [...new Array(cells.length)].map(n => [...new Array(cells.length)]);

        for (var j = -1; j <= 1; j++)
            for (var k = -1; k <= 1; k++) {
                if ((index[0] + j < 0) || (index[1] + k < 0) || (index[1] + k > _c.length - 1) || (index[0] + j > _c.length - 1)) continue;
                _c[index[0] + j][index[1] + k] = 'no bomb';
            }

        let c2 = _c.length * _c.length;
        let nbombs = Math.round(Math.random() * 0.1 * c2 + 0.1 * c2);
        for (var b = 0; b < nbombs; b) {
            let p = [Math.floor(_c.length * Math.random()), Math.floor(_c.length * Math.random())];
            if (!_c[p[0]][p[1]]) {
                _c[p[0]][p[1]] = -1;
                b++;
            }
        }

        _c = _c.map((a, index) => {
            let x = index;
            return a.map((b, index) => {
                if (b === -1) return { value: b, revealed: false, flagged: false, img: Math.floor(projects.length * Math.random()) };
                let count = 0;
                for (var j = -1; j <= 1; j++)
                    for (var k = -1; k <= 1; k++) {
                        if ((x + j < 0) || (index + k < 0) || (index + k > _c.length - 1) || (x + j > _c.length - 1) || (!j && !k)) continue;
                        count += parseInt(_c[x + j][index + k]) || 0;
                    }

                return { value: -count || 0, revealed: false, flagged: false, img: Math.floor(projects.length * Math.random()) }
            })
        })

        this.setState({ cells: this.floodReveal(index, _c), nbombs: nbombs, flags: 0, gamepaused: false });
    }

    floodReveal(index, cells) {
        var j, k;
        if (cells[index[0]][index[1]].revealed && cells[index[0]][index[1]].value > 0) {
            var flags = 0;
            for (j = -1; j <= 1; j++)
                for (k = -1; k <= 1; k++) {
                    if ((index[0] + j < 0) || (index[1] + k < 0) || (index[1] + k > cells.length - 1) || (index[0] + j > cells.length - 1)) continue;
                    flags += cells[index[0] + j][index[1] + k].revealed ? 0 : cells[index[0] + j][index[1] + k].flagged;
                }
            if (flags >= cells[index[0]][index[1]].value)
                for (j = -1; j <= 1; j++)
                    for (k = -1; k <= 1; k++) {
                        if ((index[0] + j < 0) || (index[1] + k < 0) || (index[1] + k > cells.length - 1) || (index[0] + j > cells.length - 1)) continue;
                        cells[index[0] + j][index[1] + k].revealed = !cells[index[0] + j][index[1] + k].flagged;
                        if (!cells[index[0] + j][index[1] + k].value)
                            cells = this.floodReveal([index[0] + j, index[1] + k], cells);
                    }

            return cells;
        }

        cells[index[0]][index[1]].revealed = true;

        for (j = -1; j <= 1; j++)
            for (k = -1; k <= 1; k++) {
                if ((index[0] + j < 0) || (index[1] + k < 0) || (index[1] + k > cells.length - 1) || (index[0] + j > cells.length - 1)) continue;
                if (!cells[index[0]][index[1]].value) {
                    if (cells[index[0] + j][index[1] + k].revealed) continue;
                    cells = this.floodReveal([index[0] + j, index[1] + k], cells);
                }
            }

        return cells;
    }

    minesweep(id) {
        var index = id.split(' ').map(i => parseInt(i));
        const { cells, gameStatus } = this.state;
        const c = cells[index[0]][index[1]];
        if (!!gameStatus) return;
        if (c === undefined) this.createGame(index);
        else if (!c.flagged) {
            this.setState({ cells: this.floodReveal(index, cells) });
            this.checkWin();
        } else {
            const { projects } = this.state;
            this.modalShow(projects[c.img].title.replace(/[^a-zA-Z ]/g, "").split(' ').join('_'));
        }
    }

    changeState() {
        const { minesweeper, cells, rows, gamerestart } = this.state;
        if (minesweeper)
            if (!cells[0][0]) this.setState({ toMine: false, minesweeper: false, gamepaused: false, gamerestart: !gamerestart, gameStatus: 0 });
            else this.setState({ cells: [...new Array(rows)].map(n => [...new Array(rows)]), nbombs: 0, flags: 0, gamepaused: true, gamerestart: !gamerestart, gameStatus: 0 });
        else this.setState({ toMine: true, gamepaused: true, gamerestart: !gamerestart });
    }

    flagCell(e) {
        e.preventDefault();
        const index = e.target.id.split(' ').map(i => parseInt(i));
        let { flags, cells, gameStatus } = this.state;
        if (!!gameStatus) return;
        if (!cells[index[0]][index[1]]) return;
        cells[index[0]][index[1]].flagged = !cells[index[0]][index[1]].flagged;
        this.setState({ cells: cells, flags: flags + (!cells[index[0]][index[1]].flagged ? -1 : 1) });
    }

    render() {
        const { minesweeper, cells, projects, nbombs, gameStatus, updateModal, gamerestart, gamepaused } = this.state;
        const { clientWidth } = document.documentElement;
        return (<Fragment>
            <ModalController updateModal={updateModal} updatePage={this.props.updatePage} />
            <div className="projects">
                <div className='navpadding' />
                <div className='mineOutline'>
                    <div className="mineHeader">
                        <div className='numbs left'>
                            {[...new Array(3)].map((a, index) =>
                                <div key={index + "num"} className={`numb n${Math.floor((!minesweeper ? projects.length : nbombs - cells.map(a => a.map(c => c ? c.flagged && !c.revealed : 0).reduce((a, b) => a + b)).reduce((a, b) => a + b)) / Math.pow(10, 2 - index)) % 10}`} />
                            )}
                        </div>
                        <center className='button-container' onClick={() => this.changeState()} >
                            <div className={`button${!minesweeper ? "" : { 0: ' play', '-1': ' lose', 1: ' win' }[gameStatus]}`} />
                        </center>
                        <div className='numbs right'>
                            <ProjectTimer reset={gamerestart} paused={gamepaused} />
                        </div>
                    </div>
                    <div className='mineContainer'>
                        {!minesweeper && <div className="tile-center" style={{ width: `${(330 * Math.floor((clientWidth * 0.7 - 30) / 330) / (clientWidth * 0.7 - 30) * 100) || 100}%` }}>
                            <div className='tile-container' >
                                {projects.map((p, index) => this.mapTile(p, index))}
                            </div>
                        </div>}
                        {minesweeper && <Fragment>
                            {cells.map((m, index) => {
                                let x = index
                                return <div className='row' key={index + "row"}>
                                    {m.map((c, index) => {
                                        return <div id={`${x} ${index}`} key={`${x} ${index}col`}
                                            className={`cell${!c ? ' in' : c.revealed ? ` revealed${c.value < 0 ? ' mine' : ''}` : c.flagged ? ' flag' : ''}`}
                                            style={{ width: `${100 / cells.length}%`, ...(!!c && c.flagged && !c.revealed ? { backgroundImage: `url(${projects[c.img].img})`, ...projects[c.img].imgcss } : {}) }}
                                            onClick={(e) => this.minesweep(e.target.id)}
                                            onContextMenu={(e) => this.flagCell(e)}
                                        >
                                            <div className={`c-${!!c && c.revealed && c.value > 0 ? c.value : ''}`}>{!c ? "" : (c.revealed && c.value > 0) ? c.value : ''}</div>
                                        </div>
                                    })}
                                </div>
                            })}
                        </Fragment>}
                    </div>
                </div >
            </div>
        </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedProjects = connect(mapState, actionCreators)(Projects);
export { connectedProjects as Projects };