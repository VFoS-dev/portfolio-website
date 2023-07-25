import React, { Component, Fragment } from 'react';

export class BroncoBeam extends Component {
    render() {
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    <h1>
                        <a className='inlineImageButton' target="_blank" href='https://www.gimm.dev/projects/bronco-beam'><img src='/images/GIMMWorks.png' /></a>
                        Bronco Beam</h1>
                    <h5>Dec 21, '20 - Jul 30, '22</h5>
                    <p>Bronco BEAM is a multi-year project of GIMM Works that is a location-based app for universities. I was asked to join the team for the V2 revamp. I refactored the server and made a web admin portal so the app is customizable and dynamic for different universities. I also refactored the app's React Native code for V3 and made a best path algorithm for tours.
                    </p>
                    <div className="video">
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/3NAEDSFhHhU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                    <br />
                    <h5><a href="https://apps.apple.com/us/app/beam-tours/id1588971126">App Store</a> <a href="https://play.google.com/store/apps/details?id=com.broncobeam_mobile&hl=en_US&gl=US">Google Play</a> App made with: React Native, Javascript, OneSignal</h5>
                    <h5>Website made with: React, Javascript, AWS S3, MongoDB, OneSignal</h5>
                </center>
            </Fragment>
        );
    }
}
