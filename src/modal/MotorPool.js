import React, { Component, Fragment } from 'react';

export class MotorPool extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>
                        <a className='inlineImageButton' target="_blank" href='https://www.gimm.dev/projects'><img src='/images/worklogos/GIMMWorks.png' /></a>
                        MotorPool Services</h1>
                    <h5>Aug 25, 2022 - Jan 13, 2023</h5>
                    <p> This project is a website for Boise State's Transportation Department. This website is designed to streamline test taking and certificate signing for employees who will be driving vans. I wrote the server, applied the front-end designed by other teammates, and added PDF creation functionality for certificates. 
                    </p>
                    <h5><a href='https://motorpooldrivercertification.com' rel="noreferrer" target='_blank'>Website</a> made with: React, Javascript, Express.js, MongoDB</h5>
                </center>
            </Fragment>
        );
    }
}
