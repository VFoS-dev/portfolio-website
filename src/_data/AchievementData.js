import { fruitData } from "./FruitData";
import { projectData } from "./ProjectsData";

export const achievementsData = {
    // general achievements
    firstStep: {
        name: "The first step",
        fullDescription: "Yes, this website has achievements",
        validate: "ifnot",
        description: "Went to a new page",
    },
    allPages: {
        name: "The facade is broken",
        fullDescription: "Nothing more to see. Or is there?",
        validate: "ifall",
        data: ['intro', 'about', 'projects', 'resume', 'skills', 'socials'],
        description: "Visited all 6 pages",
    },
    doubleRotate: {
        name: "Double or nothing",
        fullDescription: "Having a cube as a website has some logistical challenges",
        validate: "ifall",
        data: ['back'],
        description: "Cube rotated twice",
    },
    secretfail: {
        name: "Thats not right",
        fullDescription: "That's a red, one step farther from the secret",
        validate: "ifhasfalse",
        description: "Got an incorrect light",
    },
    secretfailall: {
        name: "Red looks better",
        fullDescription: "You do you... but you're not going to find the secret this way",
        validate: "ifallfalse",
        description: "Got all incorrect lights",
    },
    secretreset: {
        name: "Tabula rasa",
        fullDescription: "Sometimes you've just got to start over",
        validate: "ifnot",
        description: "Discovered the reset button",
    },
    secretphotoshop: {
        name: "Those look...",
        fullDescription: "You're welcome for letting you view my greatest masterpieces",
        validate: "ifall",
        data: ['projects/secret'],
        description: "Viewed photoshoped creations",
    },
    secretStart: {
        name: "Brought to light",
        fullDescription: "Nice job, you've unlocked the secrets!",
        validate: "ifnot",
        description: "Found the secret key",
    },
    secretPage: {
        name: "Treasure hunter",
        fullDescription: "You found a secret!",
        validate: "ifin",
        data: ['about/secret', 'projects/secret', 'resume/secret', 'skills/secret', 'socials/secret'],
        description: "Looked at another secret",
    },
    secretAll: {
        name: "No stone unturned",
        fullDescription: "Now you know all my secrets... well, mostly just my code",
        validate: "ifall",
        data: ['about/secret', 'projects/secret', 'resume/secret', 'skills/secret', 'socials/secret', 'intro/secret'],
        description: "Looked at all the secrets",
    },
    completed: {
        name: "All to Discover",
        fullDescription: "You got all the achievements! On to the next adventure...",
        validate: 'otherAchievements',
        data: 'all',
        description: "Unlocked all achievements",
    },
    // intro achievements
    completedIntro: {
        visible: true,
        name: "Snake",
        fullDescription: "You are a narrow Fellow in the Grass",
        description: "Found all homepage achievements",
        validate: "otherAchievements",
        data: ['snakeStar', 'snakeLights', 'snakeGolden', 'snakeAI', 'snakeOuroboros'],
    },
    snakeStar: {
        name: "A star is born",
        fullDescription: "Couldn't wait to play the snake game? Me neither.",
        validate: "ifnot",
        description: "Play a game with only 1 yellow light",
    },
    snakeLights: {
        name: "Lights, camera, action!",
        fullDescription: "The spotlight is on you now",
        validate: "ifnot",
        description: "Play a game with all lights",
    },
    snakeGolden: {
        name: "The prestigious",
        fullDescription: "The snake game is a good way to celebrate your victory",
        validate: "ifnot",
        description: "Play a game with all yellow lights",
    },
    snakeAI: {
        name: "AI is taking over!.. or not",
        fullDescription: "AI takeovers don't happen on the first try",
        validate: "ifnot",
        description: "Watch the snake algorithm fail",
    },
    snakeOuroboros: {
        name: "Ouroboros",
        fullDescription: "The eternal cycle of life and death",
        validate: "ifnot",
        description: "Failed snake by eating itself",
    },
    // resume achievements
    completedResume: {
        visible: true,
        name: "Windows XP",
        fullDescription: "As a reward you will recieve one free license of Windows XP (you can ask ChatGPT)",
        description: "Found all resume page achievements",
        validate: "otherAchievements",
        data: ['windowStart', 'exitWindow', 'xplorer', 'editResume', 'flavResume', 'realresume'],
    },
    windowStart: {
        name: "404 start menu not found",
        fullDescription: "What, did you think everything on the desktop was going to work?",
        validate: "ifnot",
        description: "Click on the start menu ",
    },
    exitWindow: {
        name: "Forgot to save",
        fullDescription: "I hope you didn't write anything important in there",
        validate: "ifnot",
        description: "Closed the resume",
    },
    xplorer: {
        name: "Windows XPlorer",
        fullDescription: "Don't you miss Windows XP?",
        validate: "ifnot",
        description: "Messed with the window",
    },
    editResume: {
        name: "I don't like that",
        fullDescription: "I'm not liable for whatever you just wrote in my resume",
        validate: "ifnot",
        description: "Edit the resume",
    },
    flavResume: {
        name: "Something seems off",
        fullDescription: "No, I definitely wrote this",
        validate: "ifnot",
        description: "Found the ChatGPT resume",
    },
    // about achievements
    completedAbout: {
        visible: true,
        name: "Duck Hunt",
        fullDescription: "Quack",
        description: "Found all about page achievements",
        validate: "otherAchievements",
        data: ['birdEscape', 'birdShot', 'birdMax', 'birdGone', 'birdCheck1', 'birdCheck2', 'birdCheck3'],
    },
    birdEscape: {
        name: "Keeper of the peace",
        fullDescription: "The birds salute you for letting them be",
        validate: "ifmore",
        data: 9,
        description: "Let 10 birds escape",
    },
    birdShot: {
        name: "You're coming home with me",
        fullDescription: "I guess it's hunting season",
        validate: "ifnot",
        description: "Shot a bird",
    },
    birdMax: {
        name: "We flock together",
        fullDescription: "Birds of a feather...",
        validate: "ifmore",
        data: 24,
        description: "Reached max bird count",
    },
    birdGone: {
        name: "Exterminator",
        fullDescription: "Look, now they're hiding from you",
        validate: "ifnot",
        description: "Cleared out all the birds",
    },
    birdCheck1: {
        name: "Hunter",
        fullDescription: "Duck's on the menu tonight",
        validate: "ifmore",
        data: 4,
        description: "Shot 5 bird",
    },
    birdCheck2: {
        name: "Marksman",
        fullDescription: "I think you might be over your quota",
        validate: "ifmore",
        data: 24,
        description: "Shot 25 bird",
    },
    birdCheck3: {
        name: "Sniper",
        fullDescription: "You miss every shot you don't take",
        validate: "ifmore",
        data: 149,
        description: "Shot 150 bird",
    },
    // projects achievements
    completedProjects: {
        visible: true,
        name: "Minesweeper",
        fullDescription: "Time to go play solitaire",
        description: "Found all project page achievements",
        validate: "otherAchievements",
        data: ['mineFlag', 'projectAll', 'projectStart', 'winMinesweeper', 'mineRunner', 'mineBoom', 'mineStart'],
    },
    mineFlag: {
        name: "Quick ad from our sponsor",
        fullDescription: "Were you expecting a flag?",
        validate: "ifnot",
        description: "Clicked on a minesweeper flag",
    },
    projectAll: {
        name: "Historian",
        fullDescription: "Now you've seen all my projects",
        validate: "ifall",
        data: projectData.map(p => p.title.replace(/[^a-zA-Z ]/g, "").split(' ').join('_').toLocaleLowerCase()),
        description: "Visited all projects",
    },
    projectStart: {
        name: "Wait there is information",
        fullDescription: "Oh yeah, that's what this site is for",
        validate: "ifnot",
        description: "Visited one project",
    },
    winMinesweeper: {
        name: "Bomb squad",
        fullDescription: "We now know who to call",
        validate: "ifnot",
        description: "Won minesweeper",
    },
    mineRunner: {
        name: "Speedrunner",
        fullDescription: "That was some fast minesweeping",
        validate: 'ifless',
        data: 60,
        description: "Won minesweeper within a minute",
    },
    mineBoom: {
        name: "Kaboom",
        fullDescription: "Mission failed, we'll get 'em next time",
        validate: "ifnot",
        description: "Failed minesweeper",
    },
    mineStart: {
        name: "Oh wait that's a game",
        fullDescription: "Try not to blow up",
        validate: "ifnot",
        description: "Activate minesweeper",
    },
    // skills achievements
    completedSkills: {
        visible: true,
        name: "Star Wars",
        fullDescription: "Luck is your father",
        description: "Found all skill page achievements",
        validate: "otherAchievements",
        data: ['skillSort'],
    },
    skillSort: {
        name: "Order 66",
        fullDescription: "Roger Roger",
        validate: "ifnot",
        description: "Sorted the lightsabers",
    },
    // social achievements
    completedSocials: {
        visible: true,
        name: "Fruit Ninja",
        fullDescription: "Are you tired of slicing fruit yet?",
        description: "Found all social page achievements",
        validate: "otherAchievements",
        data: ['socialYouTube', 'socialGithub', 'socialLinkedin', 'socialLeetCode', 'fruitinit', 'fruitcomplete', 'fruitCheck1', 'fruitEscape', 'fruitCheck2', 'fruitCheck3', 'fruitCatapult'],
    },
    realresume: {
        name: "Ooh fancy",
        fullDescription: "I made my resume using HTML, by the way",
        validate: "ifnot",
        description: "Look at the actual resume",
    },
    socialYouTube: {
        name: "Like and Subscribe",
        fullDescription: "Oh no, you found my speedruns",
        validate: "ifnot",
        description: "Visited YouTube",
    },
    socialGithub: {
        name: "Did you rebase",
        fullDescription: "Let me ask my PR",
        validate: "ifnot",
        description: "Visited Github",
    },
    socialLinkedin: {
        name: "Open for work",
        fullDescription: "Either way, I'll still be coding",
        validate: "ifnot",
        description: "Visited Linkedin",
    },
    socialLeetCode: {
        name: "Why is this here?",
        fullDescription: "Eh, I'll touch it again eventually",
        validate: "ifnot",
        description: "Visited LeetCode",
    },
    fruitinit: {
        name: "Junior chef",
        fullDescription: "Time to slice some fruit!",
        validate: "ifnot",
        description: "Played endless mode",
    },
    fruitcomplete: {
        name: "It's all skill",
        fullDescription: "You've sliced every type of fruit!",
        validate: "ifall",
        data: Object.keys(fruitData),
        description: "Sliced every type of fruit",
    },
    fruitCheck1: {
        name: "Slice and dice",
        fullDescription: "Now you've got a fruit pie",
        validate: "ifmore",
        data: 9,
        description: "Sliced 10 fruits",
    },
    fruitEscape: {
        name: "Fruits are friends not food",
        fullDescription: "Are you avoiding the fruit on purpose?",
        validate: "ifmore",
        data: 14,
        description: "Missed 15 fruits",
    },
    fruitCheck2: {
        name: "A-peeling Swordmaster",
        fullDescription: "Time to make a fruit salad",
        validate: "ifmore",
        data: 29,
        description: "Sliced 30 fruits",
    },
    fruitCheck3: {
        name: "Master chef",
        fullDescription: "That's enough fruit to feed a whale. Can whales eat fruit?",
        validate: "ifmore",
        data: 99,
        description: "Sliced 100 fruits",
    },
    fruitCatapult: {
        name: "It's not a bug, it's a feature",
        fullDescription: "Oh look, you found the fruit explosion that I definitely intended to create",
        validate: "ifmore",
        data: 29,
        description: "Spawned 30 fruit at once",
    },
}