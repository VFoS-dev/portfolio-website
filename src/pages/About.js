import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import '../css/about.css';

class About extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ducks: [],
            ducksKeys: [],
            duckAni: false,
            limited: null,
            addingDucks: false,
            maxDuck: 2,
            hitDucks: 0
        }
        this.moveDucks = this.moveDucks.bind(this)
    }

    async AddDucks(n) {
        this.setState({ addingDucks: true })
        while (this.state.ducks.length < n) {
            await this.timeout(500)
            const { ducks, ducksKeys } = this.state;
            var newduck = this.addDuck()
            if (window.location.pathname !== '/about') break;
            this.setState({
                ducks: [...ducks, newduck],
                ducksKeys: [...ducksKeys, newduck.id]
            })
            await this.timeout(500)
        }
        this.setState({ addingDucks: false })
    }

    addDuck() {
        const rand = Math.floor(Math.random() * 5)
        var right, top, angle = rand - 2;
        const dir = {
            0: { top: 0, right: 1, ani: 'left' },
            1: { top: -0.7, right: -0.7, ani: 'up-right' },
            2: { top: -1, right: 0, ani: 'up' },
            3: { top: -0.7, right: 0.7, ani: 'up-left' },
            4: { top: 0, right: -1, ani: 'right' },
        }[rand]

        const type = {
            0: 'green', 1: 'blue', 2: 'brown',
        }[Math.floor(3 * Math.random())]

        switch (rand) {
            case 0:
            case 4:
                top = 20 + 60 * Math.random()
                right = 50 + (!rand ? -1 : 1) * 60
                break;
            default:
                top = 100
                right = !angle ?
                    10 + 80 * Math.random() :
                    50 + 40 * (2 * Math.random() - 1)
                break;
        }

        return { dir: dir, pos: { right, top }, type: type, dead: false, noise: 20 * Math.random(), speed: 0.2 + 0.2 * Math.random(), id: this.createKey() }
    }

    createKey() {
        var l = "abcdefghijklmnopqurstuvwyz"
        var key = [...l].map(a => l[Math.floor(Math.random() * l.length)]).join("")
        return !this.state.ducksKeys.includes(key) ? key : this.createKey()
    }

    async moveDucks() {
        this.setState({ duckAni: true })
        while (this.state.ducks.length > 0) {
            await this.timeout(24)
            if (window.location.pathname !== '/about') break;
            const { ducks } = this.state;
            this.setState({
                ducks: ducks.map(a => {
                    if (a.pos.top < -5 - a.noise || a.pos.right < -5 - a.noise || a.pos.right > 105 + a.noise)
                        return this.addDuck()

                    return {
                        ...a,
                        pos: a.dead ? a.pos : {
                            right: a.pos.right + a.speed * a.dir.right,
                            top: a.pos.top + a.speed * a.dir.top
                        },
                    }
                })
            })
        }

        this.setState({ duckAni: false })
    }

    duckRespawn(id) {
        const { ducks, limited } = this.state
        this.setState({ ducks: (limited) ? ducks.filter(a => (a.id !== id)) : ducks.map(a => (a.id === id ? this.addDuck() : a)) })
    }

    hitDuck(id) {
        const { ducks, hitDucks } = this.state
        this.setState({
            ducks: ducks.map(d => ((id === d.id) ? { ...d, dead: true } : d)),
            hitDucks: hitDucks + 1,
            maxDuck: Math.min(25, 2 + Math.floor(hitDucks / 5))
        })
    }

    timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    visualizeDucks() {
        const { ducks } = this.state;
        return ducks.map(d => <div id={d.id} key={d.id} className={`bird ${d.dead ? "death" : ""}`} style={{ top: `${d.pos.top}vh`, right: `${d.pos.right}vw` }} onAnimationEnd={(e) => (this.duckRespawn(e.target.id))} onClick={(e) => this.hitDuck(e.target.id)}>
            <div className='crosshair' id={d.id} />
            <div id={d.id} className={`${d.type} ${d.dead ? "hit" : ""} ${d.dir.ani}`} style={{ scale: '3' }} />
        </div>)
    }

    render() {
        const { ducks, duckAni, limited, addingDucks, maxDuck, hitDucks } = this.state;
        if (ducks.length > 0 && !duckAni) this.moveDucks()
        if (ducks.length < maxDuck && typeof limited != 'boolean' && !addingDucks) this.AddDucks(maxDuck)

        return (<Fragment>
            <div className='sticky-overlay' >
                {this.visualizeDucks()}
                <div className='grass' />
                {hitDucks > 0 && <div className='score'>
                    score: {hitDucks} <br />
                    ducks: {ducks.filter(a => !a.dead).length}/{maxDuck} {maxDuck < 25 && `x(${(hitDucks - 1) % 5}/5)`}
                </div>}
                <div className={`dog${typeof limited != 'boolean' ? "" : limited ? " retrieve" : " unbound"}`} onAnimationEnd={() => this.setState({ limited: !limited ? null : limited })} onClick={() => this.setState({ limited: !limited })} />
            </div>
            <div className="about">
                <div className='navpadding' />
                <div className='info'>
                    <p>Hello I'm Jon Kido, a Full Stack and Game Developer</p>
                    <br />
                    <p>Early life:</p>
                    <p className='tab'>Ever since I got my hands on Legos when I was a little kid, I have been interested in creating things. My bedroom at the time had a walkable pathway from the door to the bed and a piles of legos on the ground everywhere else.</p>
                    <p className='tab'>Throughout middle school I offen attended summer camps (Ida-Haven) in McCall Idaho, this is where I realized I had a passion for Robotics, Water Sports, and Archery.</p>
                    <p className='tab'>This journey continued all the way to high school where I took all of the Engineering classes I could, and some basic 3d modeling. This is where I got addicted to video games and created the tag V~FoS later removing the tilde.</p>
                    <p className='tab'>Ending High shool I didnt have a sense of direction for colleges or degrees, there were too many options and couldn't decide; So I took a year off.</p>
                    <br />
                    <p>University:</p>
                    <p className='tab'>Entering College as a part time student, I attended courses from GIMM, where I quickly fell in love with the major.</p>
                    <p className='tab'>At the end of my first year I was contacted by the director, Anthony Ellertson, to become a peer mentor. During my job as a peer mentor i was nicknamed "The Wizard" because of my ability to debug everything thrown at me. Later I joined the development team for the major.</p>
                    <br />
                    <p>Origin of VFoS:</p>
                    <p className='tab'>
                        VFoS was created during high school as V~FoS, when I was into the game Super Smash Bros: Melee. 
                        This tag was inspired by an Anime series I was watching at the time, Kenichi: The Mightiest Disciple. 
                        The villains of this Anime were part of a gang called The Fists of Ragnarok. 
                        My favorite villain was The Fifth Fist of Ragnarok, Hibiki Kugenin, he was a pianist who wouldn't give up and tricked his opponents by faking getting hit to do a potent counterattack. 
                        So in the end VFoS is the acronym: Fifth Fist of Smash. Although I have stopped playing Smash the tag has stuck with me because of the memories I have with it.
                    </p>
                </div>
            </div>
        </Fragment>);
    }
}

function mapState(state) {
    return {};
}

const actionCreators = {};

const connectedAbout = connect(mapState, actionCreators)(About);
export { connectedAbout as About };