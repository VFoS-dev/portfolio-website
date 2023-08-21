import React, { Component, Fragment } from 'react';
import { matraexProjects } from '../_data';

export class Matraex extends Component {
    createlinks(link) {
        let links = [], about = false;
        let label = {
            website: 'Website',
            android: 'Google Play',
            apple: 'App Store',
        };
        Object.keys(link).forEach((l, i) => {
            switch (l) {
                case 'about': return about = link[l];
                default: return links.push(<a key={`links-${i}`} href={link[l]} rel='noreferrer' target='_blank'>{label[l]}</a>);
            }
        });

        return [links, about];
    }

    render() {
        const { focus } = this.props;
        const { name, description, link, dates, stack, keyFeatures } = matraexProjects[focus];
        const [links, about] = this.createlinks(link);
        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    {focus !== 'matraex_inc' && <Fragment>
                        <h4>This project is a client project for Matraex Inc.</h4>
                        <p>which unfortunately means I can't go into great detail</p>
                        <hr />
                    </Fragment>}
                        <h1>{name}</h1>
                        <h5>{dates}</h5>
                        <p>{description}</p>
                        {!!keyFeatures && <div style={{ textAlign: 'left' }}>
                            <h5>Noteables:</h5>
                            <ul>
                                {keyFeatures.split('-').map((k, i) => (k.replace(/\s+/, '')) ? <li key={`${focus}-${i}`}>{k}</li> : '')}
                            </ul>
                        </div>}
                        <h5 className='made-with'>{links.length ? <Fragment>{links} m</Fragment> : 'M'}ade with: {stack}</h5>
                        {about && <a href={link['about']} rel="noreferrer" target='_blank'>Learn more</a>}
                    
                </center>
            </Fragment>
        );
    }
}