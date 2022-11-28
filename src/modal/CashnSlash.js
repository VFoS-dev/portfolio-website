import React, { Component, Fragment } from 'react';

export class CashnSlash extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>Cash n' Slash</h1>
                    <h5>Sep 14 - Nov 17, 2020</h5>
                    <p>Cash n' Slash was a VR project made for Idaho Central Credit Union while I worked for GIMM Works. ICCU wanted a VR cash tornado alternative. I worked with a team of other people to create a VR game. I focused on a custom physics system and a VR suitable keyboard.</p>
                    <div className="video" >add video</div>
                    <br />
                    <h5>Made with: Unity, C#, Blender</h5>
                    <br />
                    <hr />
                    <br />
                    <h1>Early Development</h1>
                    <br />
                    <p>Early VR Keyboard</p>
                    <p>This keyboard uses the right joystick of the VR controllers to move around the alphabet (left/right), and capitalize or lowercase (up/down), then uses the A button to input the letter, and B to backspace. This keyboard was later upgraded to allow for point controls.</p>
                    <video className='video' controls><source src="/images/projects/info/vrKeyboard.mp4" type="video/mp4" /></video>
                    <br /><br />
                    <h1>Early Cash Physics</h1>
                    <p>The cash model's verticies were linked to a set of particles that would follow physics and collide with objects in the scene.</p>
                    <video className='video' controls><source src="/images/projects/info/moneyPhysics.mp4" type="video/mp4" /></video>
                    <br /><br />
                    <h1>Cash Textures</h1>
                    <br />
                    <p>These were the availiable textures I applied to the the particle-based models.</p>
                    <img src="/images/projects/info/cashTextures.png" width="100%" alt='' />
                    <br /><br />
                    <h1>Cash Physics</h1>
                    <br />
                    <p>To allow for the feeling of being in a cash tornado I created these gravity objects that would pull particles to them if they were close enough, instead of them being pulled to the base downwards gravity in the scene.</p>
                    <img src="/images/projects/info/cashGravity.gif" width="100%" alt=''/>
                    <br /><br />
                    <h1>Simple Model Animation</h1>
                    <br />
                    <p>This was a simple low poly building I modeled, with custom animated text objects that later had light emissions to apply a more futuristic feel.</p>
                    <img src="/images/projects/info/cafe.gif" width="100%" alt=''/>
                </center>
            </Fragment>
        );
    }
}
