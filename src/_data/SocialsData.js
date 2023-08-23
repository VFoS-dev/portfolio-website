




export const social_Data = [
    {
        name: 'Coming Soon',
        href: 'game-start',
        gif: '/images/socials/game/pineapple.gif',
        ring: '/images/socials/svg/soon.svg',
        shadow: '/images/socials/svg/shadow.svg',
        upper: { fill: 'white', stroke: 'black' },
        lower: { fill: 'white', stroke: 'black' },
    },
    {
        name: 'Github',
        gif: '/images/socials/github.gif',
        href: 'https://github.com/VFoS-dev',
        ring: '/images/socials/svg/github.svg',
        shadow: '/images/socials/svg/shadow-rainbow.svg',
        upper: { fill: 'white', stroke: 'black' },
        lower: { fill: 'white', stroke: 'black' },
    },
    {
        name: 'Linkedin',
        gif: '/images/socials/linkedin.gif',
        href: 'https://www.linkedin.com/in/jon-kido-vfos/',
        ring: '/images/socials/svg/linkedin.svg',
        shadow: '/images/socials/svg/shadow.svg',
        upper: { fill: 'yellow', stroke: '#700000' },
        lower: { fill: '#dce6fc', stroke: '#002d8f' },
    },
    {
        name: 'YouTube',
        gif: '/images/socials/youtube.gif',
        href: 'https://www.youtube.com/channel/UCbHIwUTtZwRiiPTyl_3ncLQ/',
        ring: '/images/socials/svg/youtube.svg',
        shadow: '/images/socials/svg/shadow.svg',
        upper: { fill: '#dce6fc', stroke: '#002d8f' },
        lower: { fill: '#dce6fc', stroke: '#002d8f' },
    },
    {
        name: 'LeetCode',
        gif: '/images/socials/leetcode.gif',
        href: 'https://leetcode.com/VFoS/',
        ring: '/images/socials/svg/leetcode.svg',
        shadow: '/images/socials/svg/shadow.svg',
        upper: { fill: 'yellow', stroke: '#700000' },
        lower: { fill: 'yellow', stroke: '#700000' },
    },
]
export const socialsData = (rots = []) => {
    if (rots.length) return social_Data.map((d, i) => ({ ...d, startRot: rots[i] }))
    return social_Data.map(d => ({ ...d, startRot: Math.random() * 360 }))
}