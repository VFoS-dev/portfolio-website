const setSort = (arr) => arr.sort(({ name: a }, { name: b }) => a.localeCompare(b));

export const skillData = [
    {
        name: 'Applications',
        textColor: '#335cff',
        color: 'blue',
        set: setSort([
            { name: 'Adobe Animate', compentence: 95 },
            { name: 'Blender', compentence: 73 },
            { name: 'Docker', compentence: 50 },
            { name: 'Insomnia', compentence: 85 },
            { name: 'Krita', compentence: 78 },
            { name: 'Photoshop', compentence: 60 },
            { name: 'Substance Painter', compentence: 40 },
            { name: 'Unity', compentence: 90 },
            { name: 'Unreal', compentence: 79 },
        ]),
    },
    {
        name: 'Frameworks',
        color: 'magenta',
        set: setSort([
            { name: '.Net', compentence: 65 },
            { name: 'Bootstrap', compentence: 76 },
            { name: 'Express.js', compentence: 90 },
            { name: 'Ionic', compentence: 50 },
            { name: 'JQuery', compentence: 83, linkedin: 5 },
            { name: 'Node.js', compentence: 80 },
            { name: 'React', compentence: 96 },
            { name: 'React Native', compentence: 80 },
            { name: 'Redux.js', compentence: 82 },
        ]),
    },
    {
        name: 'Coding Languages',
        color: 'orange',
        set: setSort([
            { name: 'ActionScript 3 (AS3)', compentence: 70 },
            { name: 'AutoHotKey (AHK)', compentence: 82 },
            { name: 'C++', compentence: 84 },
            { name: 'C#', compentence: 88 },
            { name: 'JavaScript', compentence: 100, linkedin: 5 },
            { name: 'PHP', compentence: 95, linkedin: 5 },
            { name: 'Python', compentence: 76 },
        ]),
    },
    {
        name: 'Language Derivatives',
        color: 'yellow',
        set: setSort([
            { name: 'CSS', compentence: 93, linkedin: 5 },
            { name: 'HTML', compentence: 90, linkedin: 5 },
            { name: 'JSON', compentence: 100, linkedin: 5 },
            { name: 'MarkDown', compentence: 75 },
            { name: 'RegEx', compentence: 94 },
        ]),
    },
    {
        name: 'Databases',
        color: '#a733ff',
        set: setSort([
            { name: 'MongoDB', compentence: 90 },
            { name: 'SQL', compentence: 87 },
        ]),
    },
    {
        name: 'Version Control',
        color: 'green',
        set: setSort([
            { name: 'git', compentence: 93 },
        ]),
    },
    {
        name: 'Cloud Services',
        color: 'white',
        set: setSort([
            { name: 'AWS', compentence: 93 },
            { name: 'Azure', compentence: 50 },
            { name: 'Firebase', compentence: 63 },
            { name: 'Google APIs', compentence: 83 },
            { name: 'MongoDB Atlas', compentence: 87 },
            { name: 'NGINX', compentence: 90 },
        ]),
    },
    {
        name: 'Misc.',
        color: 'red',
        set: setSort([
            { name: 'Agile Methodology', compentence: 99 },
            { name: 'Rider', compentence: 75 },
            { name: 'Visual Studio', compentence: 93 },
            { name: 'VMware', compentence: 87 },
            { name: 'VS Code', compentence: 97 },
        ]),
    },
]