import { CUBE_ROT } from "../_constants/const";

var secret = process.env.secret ? JSON.parse(process.env.secret) : [
    "right",
    "bottom",
    "bottom",
    "bottom",
    "right",
    "top",
    "top",
    "top",
    "right",
    "right"
];

export function rotation(state = origin, { type, pos }) {
    if (type != CUBE_ROT) return state;

    let { history, back, front, left, right, bottom, top } = state;

    if (!state.correct)
        switch (pos) {
            case 'right':
            case 'left':
            case 'bottom':
            case 'top':
                history.push(pos);
                if (history.length > 10) history.shift();
                break;
            case 'back':
                history.push('top');
                if (history.length > 10) history.shift();
                history.push('top');
                if (history.length > 10) history.shift();
                break;
            default: return state;
        }

    const correct = secret.map((c, index) => (history[index] || false) === c).reduce((a, b) => a + b) === secret.length;
    const checkpoints = history.map((c, index) => secret[index] === c);

    switch (pos) {
        case 'right': return { ...state, checkpoints, correct, history, right: back, left: front, back: left, front: right, };
        case 'bottom': return { ...state, checkpoints, correct, history, bottom: back, top: front, front: bottom, back: top, };
        case 'top': return { ...state, checkpoints, correct, history, top: back, bottom: front, back: bottom, front: top, };
        case 'left': return { ...state, checkpoints, correct, history, left: back, right: front, back: right, front: left, };
        case 'back': return { ...state, checkpoints, correct, history, back: front, front: back, top: bottom, bottom: top, };
        case 'front': return { ...state, checkpoints, correct, history, };
        default: return state;
    }
}

function onMount() {
    const [, view = 'intro',] = window.location.pathname.split('/')

    const pos = {
        resume: 'top',
        skills: 'left',
        about: 'right',
        projects: 'bottom',
        socials: 'back',
        intro: 'front',
    }[view.toLowerCase()]

    return rotation(defState, { type: CUBE_ROT, pos })
}

const defState = {
    top: 'resume',
    left: 'skills',
    right: 'about',
    bottom: 'projects',
    back: 'socials',
    front: 'intro',
    history: [],
    checkpoints: [],
    correct: false
}

const origin = {
    ...onMount(),
    secretLength: secret.length
}