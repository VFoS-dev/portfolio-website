import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { ModalController } from '../components/ModalController';
import { projectData } from '../_data';

import '../css/projects.css';
import { ProjectTimer } from '../components';
import { TileFlex, TileFlexTouchSupport, timeout } from '../utils';

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
            gameStatus: 0,
            rows: 15,
            refresh: false,
        };

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

    modalShow(title) {
        const { updateModal } = this.state;
        var sub = `/${window.location.pathname.split('/')[1]}/${title.toLowerCase()}`;
        window.history.replaceState(sub, 'Title', sub);
        this.setState({ updateModal: !updateModal });
    }

    mapTile({ title = '', date = '', createdIn = '', img = "", imgcss = {} }, index) {
        const { toMine, rows } = this.state;
        return (
            <div key={index + "tile"} id={title.replace(/[^a-zA-Z ]/g, "").split(' ').join('_')} className='tile' {...TileFlex(toMine)} style={{ backgroundImage: `url(${img})`, ...imgcss, ...(toMine ? { boxShadow: 'none', cursor: 'auto' } : {}) }} onClick={(e) => this.modalShow(e.target.id)}>
                <div className={` ${toMine ? 'toMinesweeper' : 'overlay'}`} style={{ backgroundImage: `url(/images/projects/minesweeper/toMinesweeper.webp)` }} onAnimationEnd={() => this.setState({
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
        await timeout(0);
        const { cells } = this.state;

        var lost = false, win = 0;
        for (const row of cells) {
            for (const c of row) {
                if (c.proximity < 0 && c.revealed) {
                    lost = true; 
                    break;
                }
                if ((c.proximity >= 0 && c.revealed) || (c.proximity < 0 && c.flagged)) win++;
                else break;
            }
        }
        win = win === cells.length * cells.length;

        if (win || lost) this.setState({ gameStatus: +win || -1, gamepaused: !!(+win || -1), });
    }

    createGame([x, y]) {
        const { cells } = this.state;
        let _c = [...new Array(cells.length)].map(n => [...new Array(cells.length)]);

        for (var j = -1; j <= 1; j++)
            for (var k = -1; k <= 1; k++) {
                if ((x + j < 0) || (y + k < 0) || (y + k > _c.length - 1) || (x + j > _c.length - 1)) continue;
                _c[x + j][y + k] = 'no bomb';
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

        function getProximity(x, y, cells) {
            if (cells[x][y] === -1) return -1;
            let count = 0;
            for (var j = -1; j <= 1; j++) {
                for (var k = -1; k <= 1; k++) {
                    if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1) || (!j && !k)) continue;
                    count -= parseInt(cells[x + j][y + k]) || 0;
                }
            }
            return count;
        }

        _c = _c.map((row, x) => row.map((b, y) => ({
            proximity: getProximity(x, y, _c),
            revealed: false,
            flagged: false,
            img: Math.floor(projectData.length * Math.random())
        })))

        this.setState({ cells: this.floodReveal([x, y], _c), gamepaused: false });
    }

    floodReveal([x, y], cells) {
        var j, k;
        if (cells[x][y].revealed && cells[x][y].proximity > 0) {
            var flags = 0;
            for (j = -1; j <= 1; j++)
                for (k = -1; k <= 1; k++) {
                    if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1)) continue;
                    flags += cells[x + j][y + k].revealed ? 0 : cells[x + j][y + k].flagged;
                }
            if (flags >= cells[x][y].proximity)
                for (j = -1; j <= 1; j++)
                    for (k = -1; k <= 1; k++) {
                        if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1)) continue;
                        cells[x + j][y + k].revealed = !cells[x + j][y + k].flagged;
                        if (!cells[x + j][y + k].proximity)
                            cells = this.floodReveal([x + j, y + k], cells);
                    }

            return cells;
        }

        cells[x][y].revealed = true;

        for (j = -1; j <= 1; j++)
            for (k = -1; k <= 1; k++) {
                if ((x + j < 0) || (y + k < 0) || (y + k > cells.length - 1) || (x + j > cells.length - 1)) continue;
                if (!cells[x][y].proximity) {
                    if (cells[x + j][y + k].revealed) continue;
                    cells = this.floodReveal([x + j, y + k], cells);
                }
            }

        return cells;
    }

    minesweep(id) {
        var [x, y] = id.split(' ').map(i => parseInt(i));
        const { cells, gameStatus } = this.state;
        const c = cells[x][y];
        if (!!gameStatus) return;
        if (c === undefined) this.createGame([x, y]);
        else if (!c.flagged) {
            this.setState({ cells: this.floodReveal([x, y], cells) });
            this.checkWin();
        } else {
            this.modalShow(projectData[c.img].title.replace(/[^a-zA-Z ]/g, "").split(' ').join('_'));
        }
    }

    changeState() {
        const { minesweeper, cells, rows, gamerestart } = this.state;
        if (minesweeper)
            if (!cells[0][0]) this.setState({ toMine: false, minesweeper: false, gamepaused: false, gamerestart: !gamerestart, gameStatus: 0 });
            else this.setState({ cells: [...new Array(rows)].map(n => [...new Array(rows)]), gamepaused: true, gamerestart: !gamerestart, gameStatus: 0 });
        else this.setState({ toMine: true, gamepaused: true, gamerestart: !gamerestart });
    }

    flagCell(e) {
        e.preventDefault();
        const [x, y] = e.target.id.split(' ').map(i => parseInt(i));
        let { cells, gameStatus } = this.state;
        if (!!gameStatus || !cells[x][y] || cells[x][y].revealed) return;
        cells[x][y].flagged = !cells[x][y].flagged;
        this.setState({ cells });
        this.checkWin();
    }

    getTileAdjustment(size = 320) {
        let offset = (document.documentElement.clientWidth * .9 - 60) / size // (vw - total padding) / base width of image
        let count = Math.ceil(offset)
        let correction = Math.ceil(offset / count * size - count) - 5
        let width = count * 10 + count * correction
        return {
            "--correction": correction + "px",
            "--width": width + "px",
        }
    }

    render() {
        const { minesweeper, cells, gameStatus, updateModal, gamerestart, gamepaused, toMine } = this.state;
        const { activePage } = this.props;
        const bombCount = !minesweeper ? projectData.length : Math.max(cells.reduce((t, r) => t + (r?.reduce((st, c) => st + -c?.flagged + (c?.proximity < 0), 0)), 0), 0);

        return (<Fragment>
            <ModalController updateModal={updateModal} updatePage={this.props.updatePage} />
            <div className="projects">
                <div className='navpadding' />
                <div className='mineOutline'>
                    <div className="mineHeader">
                        <div className='numbs left'>
                            <ProjectTimer activePage={false} setCount={bombCount} />
                        </div>
                        <center className='button-container' onClick={() => this.changeState()} >
                            <div className={`button${!minesweeper ? "" : { 0: ' play', '-1': ' lose', 1: ' win' }[gameStatus]}`} />
                        </center>
                        <div className='numbs right'>
                            <ProjectTimer activePage={activePage} reset={gamerestart} paused={gamepaused} />
                        </div>
                    </div>
                    <div className='mineContainer'>
                        {minesweeper ? <Fragment>
                            {cells.map((m, x) => {
                                return <div className='row' key={x + "row"}>
                                    {m.map((c, y) => {
                                        return <div id={`${x} ${y}`} key={`${x} ${y}col`}
                                            className={`cell${!c ? ' in' : c.revealed ? ` revealed${c.proximity < 0 ? ' mine' : ''}` : c.flagged ? ' flag' : ''}`}
                                            style={{ width: `${100 / cells.length}%`, ...(!!c && c.flagged && !c.revealed ? { backgroundImage: `url(${projectData[c.img].img})`, ...projectData[c.img].imgcss, borderRadius: 0 } : {}) }}
                                            onClick={(e) => this.minesweep(e.target.id)}
                                            onContextMenu={(e) => this.flagCell(e)}
                                        >
                                            <div className={`c-${!!c && c.revealed && c.proximity > 0 ? c.proximity : ''}`}>{!c ? "" : (c.revealed && c.proximity > 0) ? c.proximity : ''}</div>
                                        </div>
                                    })}
                                </div>
                            })}
                        </Fragment> : <Fragment>
                            <div className="tile-center" style={{ ...this.getTileAdjustment() }}>
                                <div className='tile-container' {...TileFlexTouchSupport(toMine)}>
                                    {projectData.map((p, index) => this.mapTile(p, index))}
                                </div>
                            </div>
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