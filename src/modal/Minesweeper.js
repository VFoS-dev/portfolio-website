import React, { Component, Fragment } from 'react';

export class Minesweeper extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Minesweeper Solver</h1>
                    <h5>Nov 1 - Dec 4, 2020</h5>
                    <p>This project was a side project. I had challenged myself to create a minesweeper solver. It uses basic knowledge and flags the 100% bomb spots, and clears the the spots that it calculates cannot have a bomb. There are some occasions where it is unclear and has to use a probiblity calcualation based on the array of neigboring cells. The algorithm first clicks any spots where it has a 0% probiblity of a bomb being there and then repeats. If there isn't a valid direction it will click the flag in the location with the highest possiblity of there being a bomb and continue.</p>
                    <video className='video' controls><source src="/images/projects/info/minesweepersolver.mp4" type="video/mp4" /></video>
                    <br />
                    <h5>Made with: Unity, C#, <a href='https://github.com/VFoS-dev/MinesweeperSolver' rel="noreferrer" target='_blank'>Github</a></h5>
                </center>
            </Fragment>
        );
    }
}
