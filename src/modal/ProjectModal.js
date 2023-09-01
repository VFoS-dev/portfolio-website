import React, { Component, Fragment } from 'react';
import { projectData } from '../_data';
import { formatDate } from '../utils';

export class ProjectModal extends Component {
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

    render() {
        const { focus } = this.props;
        const { fullName, title, description, link, stack, keyFeatures, parent, content, meanings, ...rem } = projectData[focus];
        const date = formatDate(rem);
        const [links, about] = this.createlinks(link);
        const Title = HandleHeader.Input(fullName ?? title, parent);

        return (
            <Fragment>
                <center style={{ margin: "4% 0px", padding: '0px 15%' }}>
                    {Title}
                    <h5>{date}</h5>
                    <p>{description}</p>
                    {meanings && <Fragment>
                        {Object.keys(meanings).map(m =>
                            <p>Meaning behind: <a href={meanings[m]}>{m}</a></p>
                        )}
                    </Fragment>}
                    {!!keyFeatures && <div style={{ textAlign: 'left' }}>
                        <h5>Noteables:</h5>
                        <ul>
                            {keyFeatures.split('- ').map((k, i) => (k.replace(/\s+/, '')) ? <li key={`${focus}-${i}`}>{k}</li> : '')}
                        </ul>
                    </div>}
                    {content && content.map((c, i) => <Fragment key={`${focus}-${i}`}>{HandleContent.Input(c)}</Fragment>)}
                    <h5 className='made-with'>{links?.length ? <Fragment>{links} m</Fragment> : 'M'}ade with: {stack}</h5>
                    {about && <a href={link['about']} rel="noreferrer" target='_blank'>Learn more</a>}
                </center>
            </Fragment>
        );
    }
}

class HandleContent {
    static Input = (content) => typeof content === 'string' ?
        this.StringInput(content) : this.ObjectInput(content);
    static StringInput = (src) =>
        this[this.FindFunction(src)]({ src });
    static ObjectInput = (info = {}) =>
        this[this.FindFunction(info.src)](info);

    static FindFunction(src) {
        if (/youtube/.test(src)) return 'YouTube';
        if (/(png|gif)$/.test(src)) return 'Image';
        if (/mp4$/.test(src)) return 'Video';
        if (/swf$/.test(src)) return 'Flash';
        if (src === '/' || /^http/.test(src)) return 'IFrame';
        return 'Skip';
    }

    static Skip = () => <Fragment />;
    static Flash({ src, title = 'Playable Flash game' }) {
        return <Fragment>
            {title && <h1>{title}</h1>}
            <p>This project is a Flash game. If you want to play it for yourself, you will have to use a supporting brower like <a href='https://www.palemoon.org' rel="noreferrer" target="_blank">Pale Moon</a>.</p>
            <div className="video" >
                <object height="100%" width="100%" type="application/x-shockwave-flash" data={src} aria-label="flash game" />
            </div>
        </Fragment>
    }

    static Video({ src, title, description }) {
        return <Fragment>
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
            <video className='video' controls>
                <source src={src} type="video/mp4" />
            </video>
        </Fragment>
    }

    static Image({ src, title, description }) {
        return <Fragment>
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
            <img src={src} width="100%" alt='' />
        </Fragment>
    }

    static YouTube({ src, title, description }) {
        return <Fragment>
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
            <div className="video">
                <iframe width="100%" height="100%" src={src} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        </Fragment>
    }
    static IFrame({ src, title, description }) {
        return <Fragment>
            {title && <h1>{title}</h1>}
            {description && <p>{description}</p>}
            <iframe src={src} title='portfolio' style={{ width: '100%', aspectRatio: '16/9', position: 'relative' }} />
        </Fragment>
    }
}

class HandleHeader {
    static Input = (title, parent) => (!parent || !this[parent]) ?
        this.default(title) : this[parent](title);
    static default = (title) =>
        <h1>{title}</h1>;

    static matraex_inc = (title) =>
        <Fragment>
            <h4>This project is a client project for <a href='/projects/matraex_inc'>Matraex Inc.</a>
            </h4>
            <p>which unfortunately means I can't go into great detail</p>
            <hr />
            <h1>{title}</h1>
        </Fragment>;

    static gimmworks = (title) =>
        <h1>
            <a className='inlineImageButton' target="_blank" href='https://www.gimm.dev/projects'>
                <img src='/images/worklogos/GIMMWorks.png' />
            </a>
            {title}
        </h1>;
}