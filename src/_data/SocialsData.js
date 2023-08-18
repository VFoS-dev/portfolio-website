export const socialsData = [
    {
        name: 'Coming Soon',
        gif: '/images/socials/game/pineapple.gif',
        startRot: Math.random() * 360,
        styles: {
            outerLine: 'white',
            innerLine: 'white',
            textBorder: 'black',
            textColor: 'white'
        }
    },
    {
        id: '',
        name: 'Github',
        gif: '/images/socials/github.gif',
        startRot: Math.random() * 360,
        href: 'https://github.com/VFoS-dev',
        styles: {
            foreignShadow: <foreignObject x="2" y="2" width="164" height="164" mask="url(#donut)">
                <div className="rainbowGradient" />
            </foreignObject>,
            foreign: <foreignObject x="2" y="2" width="164" height="164" mask="url(#donut)">
                <div className="rainbowGradient" />
            </foreignObject>,
            outerLine: 'white',
            innerLine: 'white',
            textBorder: 'black',
            textColor: 'white'
        }
    },
    {
        id: 'pattern1',
        name: 'Linkedin',
        gif: '/images/socials/linkedin.gif',
        startRot: Math.random() * 360,
        href: 'https://www.linkedin.com/in/jon-kido-vfos/',
        styles: {
            fill: <linearGradient
                id="pattern1"
                gradientTransform="rotate(30)">
                <stop offset="0%" stopColor="rgba(255,0,0,0.5)" />
                <stop offset="20%" stopColor="rgba(255,0,0,0.5)" />
                <stop offset="95%" stopColor="rgba(0,0,255,0.5)" />
                <stop offset="100%" stopColor="rgba(0,0,255,0.5)" />
            </linearGradient>,
            outerLine: '#4b61db',
            innerLine: '#db4b4b',
            text: {
                upperBorder: '#700000',
                upperColor: 'yellow',
                lowerBorder: '#002d8f',
                lowerColor: '#dce6fc',
            }
        }
    },
    {
        id: 'pattern3',
        name: 'YouTube',
        gif: '/images/socials/youtube.gif',
        startRot: Math.random() * 360,
        href: 'https://www.youtube.com/channel/UCbHIwUTtZwRiiPTyl_3ncLQ/',
        styles: {
            fill: <pattern id="pattern3" width="25" height="1" patternUnits="userSpaceOnUse" patternTransform="rotate(45 50 50)">
                <rect fill='rgba(0, 86, 255, 0.5)' width='25px' height='10px' />
                <line stroke='rgba(61, 127, 255, 0.5)' strokeWidth="25px" y2="10" />
            </pattern>,
            outerLine: '#3469d1',
            innerLine: '#3469d1',
            textBorder: '#002d8f',
            textColor: '#dce6fc'
        }
    },
    {
        id: '',
        name: 'LeetCode',
        gif: '/images/socials/leetcode.gif',
        startRot: Math.random() * 360,
        href: 'https://leetcode.com/VFoS/',
        styles: {
            foreign: <foreignObject x="2" y="2" width="164" height="164" mask="url(#donut)">
                <div className="gradient" />
            </foreignObject>,
            outerLine: 'rgba(255,100,100,0.5)',
            innerLine: 'rgba(255,100,100,0.5)',
            textBorder: '#700000',
            textColor: 'yellow'
        }
    },
]