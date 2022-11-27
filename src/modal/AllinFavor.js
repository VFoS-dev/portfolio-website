import React, { Component, Fragment } from 'react';

export class AllinFavor extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>All in Favor</h1>
                    <h5>Sept 4, '21 - Jan 6, '22</h5>
                    <p>I hopped onto this project towards the end of it. When I joined it wasn't in the best place for security, and there was no networking for the game.
                        The first thing that I did for this project was remove the saving of the user's password locally, and instead converted it to a JSON Web Token that
                        contains no critical user data. The next steps were to add networking. I created all of the game's net code.
                    </p>
                    <div className="video">
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/lfqCeVwhvLk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <br />
                    <h5><a href='https://www.allinfavor.org' rel="noreferrer" target="_blank">Website</a> made with: React, Javascript, Socket.io, Express.js, MongoDB</h5>
                </center>
            </Fragment>
        );
    }
}