const setSort = (arr) => arr.sort(({ name: a }, { name: b }) => a.localeCompare(b));

export const skillData = [
    {
        name: 'Applications',
        textColor: '#335cff',
        color: 'blue',
        set: setSort([
            { name: 'Adobe Animate', compentence: 95, category: 'software' },
            { name: 'Blender', compentence: 73, category: 'software' },
            { name: 'Docker', compentence: 60, category: 'software' },
            { name: 'Insomnia', compentence: 85, category: 'software' },
            { name: 'Krita', compentence: 78, category: 'software' },
            { name: 'Photoshop', compentence: 60, category: 'software' },
            { name: 'Substance Painter', compentence: 40, category: 'software' },
            { name: 'Unity', compentence: 90, category: 'software' },
            { name: 'Unreal', compentence: 79, category: 'software' },
        ]),
    },
    {
        name: 'Frameworks',
        color: 'magenta',
        set: setSort([
            { name: '.Net', compentence: 65, category: 'coding' },
            { name: 'Bootstrap', compentence: 76, category: 'coding' },
            { name: 'Express.js', compentence: 90, category: 'coding' },
            { name: 'Ionic', compentence: 50, category: 'coding' },
            { name: 'JQuery', compentence: 83, linkedin: 5, category: 'coding' },
            { name: 'Node.js', compentence: 80, category: 'coding' },
            { name: 'React', compentence: 96, category: 'coding' },
            { name: 'React Native', compentence: 80, category: 'coding' },
            { name: 'Redux.js', compentence: 82, category: 'coding' },
        ]),
    },
    {
        name: 'Coding Languages',
        color: 'orange',
        set: setSort([
            { name: 'ActionScript 3 (AS3)', compentence: 70, category: 'coding' },
            { name: 'AutoHotKey (AHK)', compentence: 82, category: 'coding' },
            { name: 'C++', compentence: 84, category: 'coding' },
            { name: 'C#', compentence: 88, category: 'coding' },
            { name: 'JavaScript', compentence: 100, linkedin: 5, category: 'coding' },
            { name: 'PHP', compentence: 95, linkedin: 5, category: 'coding' },
            { name: 'Python', compentence: 76, category: 'coding' },
        ]),
    },
    {
        name: 'Language Derivatives',
        color: 'yellow',
        set: setSort([
            { name: 'CSS', compentence: 93, linkedin: 5, category: 'coding' },
            { name: 'HTML', compentence: 90, linkedin: 5, category: 'coding' },
            { name: 'JSON', compentence: 100, linkedin: 5, category: 'coding' },
            { name: 'MarkDown', compentence: 75, category: 'coding' },
            { name: 'RegEx', compentence: 94, category: 'coding' },
        ]),
    },
    {
        name: 'Databases',
        color: '#a733ff',
        set: setSort([
            { name: 'MongoDB', compentence: 90, category: 'software' },
            { name: 'SQL', compentence: 87, category: 'software' },
        ]),
    },
    {
        name: 'Version Control',
        color: 'green',
        set: setSort([
            { name: 'git', compentence: 93, category: 'software' },
        ]),
    },
    {
        name: 'Cloud Services',
        color: 'white',
        set: setSort([
            { name: 'AWS', compentence: 93, category: 'software' },
            { name: 'Azure', compentence: 50, category: 'software' },
            { name: 'Firebase', compentence: 63, category: 'software' },
            { name: 'Google APIs', compentence: 83, category: 'software' },
            { name: 'MongoDB Atlas', compentence: 87, category: 'software' },
            { name: 'NGINX', compentence: 90, category: 'software' },
        ]),
    },
    {
        name: 'Misc.',
        color: 'red',
        set: setSort([
            { name: 'Agile Methodology', compentence: 99, category: 'software' },
            { name: 'Rider', compentence: 75, category: 'software' },
            { name: 'Visual Studio', compentence: 93, category: 'software' },
            { name: 'VMware', compentence: 87, category: 'software' },
            { name: 'VS Code', compentence: 97, category: 'software' },
        ]),
    },
]