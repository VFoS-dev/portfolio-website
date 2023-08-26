import { fruitData } from "./FruitData";
import { projectData } from "./ProjectsData";

export const achievementsData = {
    firstStep: { // added
        name: "The first step",
        description: "Yes, this website has achievements",
        validate: "ifnot",
        // "go to a new page"
    },
    allPages: { // added
        name: "The facade is broken",
        description: "Nothing more to see. Or is there?",
        validate: "ifall",
        data: ['intro', 'about', 'projects', 'resume', 'skills', 'socials'],
        // "visited all 6 pages"
    },
    doubleRotate: { // added
        name: "Double or nothing",
        description: "Having a cube as a website has some logistical challenges",
        validate: "ifall",
        data: ['back'],
        // "go to the back page and it has to rotate twice"
    },
    winMinesweeper: { // added
        name: "Nerd",
        description: "Or geek, who knows?",
        validate: "ifnot",
        // "won minesweeper"
    },
    mineRunner: { // added
        name: "Speedrunner",
        description: "That was some fast minesweeping",
        validate: 'ifless',
        data: 60,
        // "won minesweeper in a minute or less"
    },
    mineBoom: { // added
        name: "Mission failed, we'll get 'em next time",
        description: "Minesweeper is hard",
        validate: "ifnot",
        // "failed minesweeper"
    },
    exitWindow: { // added
        name: "Forgot to save",
        description: "I hope you didn't write anything important in there",
        validate: "ifnot",
        // "closed the resume"
    },
    xplorer: { // partal
        name: "Windows XPlorer",
        description: "Don't you miss Windows XP?",
        validate: "ifnot",
        // "moved the resume window or minimized in fake Windows XP"
    },
    maximize: { // added 
        name: "Where did the navbar go",
        description: "This is just a desktop now",
        validate: "ifnot",
        // "maximized the resume"
    },
    editResume: { // added
        name: "I don't like that",
        description: "I'm not liable for whatever you just wrote in my resume",
        validate: "ifnot",
        // "edit the resume"
    },
    flavResume: { // added
        name: "Something seems off",
        description: "No, I definitely wrote this",
        validate: "ifnot",
        // "found the ChatGPT resume"
    },
    secretStart: { // added
        name: "Brought to light",
        description: "Nice job, you've unlocked the secrets!",
        validate: "ifnot",
        // "found the secret"
    },
    secretPage: { // added
        name: "Treasure hunter",
        description: "You found a secret!",
        validate: "ifin",
        data: ['about/secret', 'projects/secret', 'resume/secret', 'skills/secret', 'socials/secret'],
        // "looked at the secret on one of the pages"
    },
    secretAll: { // added
        name: "No stone unturned",
        description: "Now you know all my secrets... well, mostly just my code",
        validate: "ifall",
        data: ['about/secret', 'projects/secret', 'resume/secret', 'skills/secret', 'socials/secret', 'intro/secret'],
        // "looked at all the secrets"
    },
    skillSort: { // added
        name: "Hierarchy",
        description: "I promise I didn't use bubble sort",
        validate: "ifnot",
        // "sorted the skills"
    },
    projectStart: {
        name: "Wait there is information",
        description: "Oh yeah, that's what this site is for",
        validate: "ifnot",
        // "visited one project"
    },
    projectAll: {
        name: "Historian",
        description: "Now you've seen all my projects",
        validate: "ifall",
        data: projectData.map(p => p.title),
        // "visited all the projects"
    },
    mineFlag: { // added
        name: "Quick ad from our sponsor",
        description: "Were you expecting a flag?",
        validate: "ifnot",
        // "clicked on a minesweeper flag"
    },
    mineTime: { // added
        name: "Can't stop thinking",
        description: "Maybe you should take a break from Minesweeper now",
        validate: "ifmore",
        data: 998,
        // "reached 999 on minesweeper "
    },
    birdEscape: { // added
        name: "Keeper of the peace",
        description: "The birds salute you for letting them be",
        validate: "ifmore",
        data: 9,
        // "dont shoot 10 birds"
    },
    birdShot: { // added
        name: "You're coming home with me",
        description: "I guess it's hunting season",
        validate: "ifnot",
        // "shot a bird "
    },
    birdMax: { // added
        name: "We flock together",
        description: "Birds of a feather...",
        validate: "ifmore",
        data: 24,
        // "reached max bird count "
    },
    birdGone: { // added
        name: "Exterminator",
        description: "Look, now they're hiding from you",
        validate: "ifnot",
        // "cleared out all the birds "
    },
    birdCheck1: { // added
        name: "Hunter",
        description: "Duck's on the menu tonight",
        validate: "ifmore",
        data: 4,
        // "got x bird points "
    },
    birdCheck2: { // added
        name: "Marksman",
        description: "I think you might be over your quota",
        validate: "ifmore",
        data: 25,
        // "got xx bird points "
    },
    birdCheck3: { // added
        name: "Sniper",
        description: "You miss every shot you don't take",
        validate: "ifmore",
        data: 129,
        // "got xxx bird points "
    },
    fruitinit: {
        name: "Junior chef",
        description: "Time to slice some fruit!",
        validate: "ifnot",
        // "discovered fruit ninja"
    },
    fruitcomplete: {
        name: "It's all skill",
        description: "You've sliced every type of fruit!",
        validate: "ifall",
        data: Object.keys(fruitData),
        // "sliced every type of fruit"
    },
    fruitCheck1: {
        name: "Slice and dice",
        description: "Now you've got a fruit pie",
        validate: "ifmore",
        data: 10,
        // "got x fruits in one session "
    },
    fruitEscape: {
        name: "Fruits are friends not food",
        description: "Are you avoiding the fruit on purpose?",
        validate: "ifmore",
        data: 14,
        // "missed xx fruits in one session "
    },
    fruitCheck2: {
        name: "A-peeling Swordmaster",
        description: "Time to make a fruit salad",
        validate: "ifmore",
        data: 29,
        // "got xx fruits in one session "
    },
    fruitCheck3: {
        name: "Master chef",
        description: "That's enough fruit to feed a whale. Can whales eat fruit?",
        validate: "ifmore",
        data: 74,
        // "got xxx fruits in one session "
    },
    fruitCatapult: {
        name: "It's not a bug it's a feature",
        description: "Oh look, you found the fruit explosion that I definitely intended to create",
        validate: "ifmore",
        data: 49,
        // "spawned 50 fruit at once "
    },
    mineStart: {
        name: "Oh wait that's a game",
        description: "Try not to blow up",
        validate: "ifnot",
        // "activate minesweeper"
    },
    windowStart: {
        name: "404 start menu not found",
        description: "What, did you think everything on the desktop was going to work?",
        validate: "ifnot",
        // "click on start menu "
    },
    completed: {
        name: "All to Discover",
        description: "You got all the achievements! On to the next adventure...",
        // "got all the other achievements "
    },
    realresume: {
        name: "Ooh fancy",
        description: "I made my resume using HTML, by the way",
        validate: "ifnot",
        // "look at the actual resume "
    },
    socialyoutube: {
        name: "Don't forget to like and subscribe",
        description: "Oh no, you found my speedruns",
        validate: "ifnot",
        // "visit youtube "
    },
    socialgithub: {
        name: "Did you rebase",
        description: "Let me ask my PR",
        validate: "ifnot",
        // "visit github "
    },
    sociallinkedin: {
        name: "Open for work",
        description: "Either way, I'll still be coding",
        validate: "ifnot",
        // "linkedin"
    },
    socialleetcode: {
        name: "Why is this here?",
        description: "Eh, I'll touch it again eventually",
        validate: "ifnot",
        // "leetcode "
    },
    secretfail: {
        name: "Thats not right",
        description: "That's a red, one step farther from the secret",
        validate: "ifin",
        data: false,
        // "get a red one "
    },
    secretfailall: {
        name: "Red looks better",
        description: "You do you... but you're not going to find the secret this way",
        validate: "ifallfalse",
        // "get all red "
    },
    secretreset: {
        name: "Tabula Rasa",
        description: "Sometimes you've just got to start over",
        validate: "ifnot",
        // "discovered secret reset "
    },
    secretphotoshop: {
        name: "Those look...",
        description: "You're welcome for letting you view my greatest masterpieces",
        validate: "ifnot",
        // "view photoshop secret"
    },
}