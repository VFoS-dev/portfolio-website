import React, { Component, Fragment } from 'react';
import { projectData } from '../_data';

export class Matraex extends Component {
    createlinks(link) {
        if (!link) return [];
        let links = [], about = false;
        let label = {
            website: 'Website',
            android: 'Google Play',
            apple: 'App Store',
            demo: 'Demo',
        };

        Object.keys(link).forEach((l, i) => {
            switch (l) {
                case 'about': return about = link[l];
                default: return links.push(<a key={`links-${i}`} href={link[l]} rel='noreferrer' target='_blank'>{label[l]}</a>);
            }
        });

        return [links, about];
    }

    createContent(content) {
        return <div className="video">
            <iframe width="100%" height="100%" src={content} title="YouTube video player" frameBorder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
    }

    render() {
        const { focus } = this.props;
        const { fullName, title, description, link, dates, stack, keyFeatures, parent, content, meanings } = projectData[focus];
        const [links, about] = this.createlinks(link);

        const { title: pTitle, fullName: pFullName } = projectData[parent] ?? {};
        const parentName = projectData[parent] ? pFullName ?? pTitle : '';

        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    {parent && <Fragment>
                        <h4>This project is a client project for <a href={`/projects/${parent}`}>{parentName}</a></h4>
                        <p>which unfortunately means I can't go into great detail</p>
                        <hr />
                    </Fragment>}
                    <h1>{fullName ?? title}</h1>
                    <h5>{dates}</h5>
                    <p>{description}</p>
                    {meanings && <Fragment>
                        {Object.keys(meanings).map(m =>
                            <p>Meaning behind: <a href={meanings[m]}>{m}</a></p>
                        )}
                    </Fragment>}
                    {!!keyFeatures && <div style={{ textAlign: 'left' }}>
                        <h5>Noteables:</h5>
                        <ul>
                            {keyFeatures.split('-').map((k, i) => (k.replace(/\s+/, '')) ? <li key={`${focus}-${i}`}>{k}</li> : '')}
                        </ul>
                    </div>}
                    {content && content.map(c => this.createContent(c))}
                    <h5 className='made-with'>{links?.length ? <Fragment>{links} m</Fragment> : 'M'}ade with: {stack}</h5>
                    {about && <a href={link['about']} rel="noreferrer" target='_blank'>Learn more</a>}
                </center>
            </Fragment>
        );
    }
}