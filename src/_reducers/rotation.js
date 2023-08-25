var secret = JSON.parse(process.env.secret || '["right","bottom","bottom","bottom","right","top","top","top","right","right"]');

export function rotation(state = origin, action) {
    var history = state.history;

    if (!state.correct)
        switch (action.type) {
            case 'right':
            case 'left':
            case 'bottom':
            case 'top':
                history.push(action.type);
                if (history.length > 10) history.shift();
                break;
            case 'back':
                history.push('top');
                history.push('top');
                if (history.length > 10) history.shift();
                if (history.length > 10) history.shift();
                break;
            default:
                break;
        }

    const correct = secret.map((c, index) => (history[index] || false) === c).reduce((a, b) => a + b) === secret.length;
    const checkpoints = history.map((c, index) => secret[index] === c);

    switch (action.type) {
        case 'right':
            return {
                ...state,
                right: state.back,
                left: state.front,
                back: state.left,
                front: state.right,
                history: history,
                checkpoints: checkpoints,
                correct: correct,
            };
        case 'bottom':
            return {
                ...state,
                bottom: state.back,
                top: state.front,
                front: state.bottom,
                back: state.top,
                history: history,
                checkpoints: checkpoints,
                correct: correct,
            };
        case 'top':
            return {
                ...state,
                top: state.back,
                bottom: state.front,
                back: state.bottom,
                front: state.top,
                history: history,
                checkpoints: checkpoints,
                correct: correct,
            };
        case 'left':
            return {
                ...state,
                left: state.back,
                right: state.front,
                back: state.right,
                front: state.left,
                history: history,
                checkpoints: checkpoints,
                correct: correct,
            };
        case 'back':
            return {
                ...state,
                back: state.front,
                front: state.back,
                top: state.bottom,
                bottom: state.top,
                history: history,
                checkpoints: checkpoints,
                correct: correct,
            };
        case 'front':
            return {
                ...state,
                history: history,
                checkpoints: checkpoints,
                correct: correct,
            }
        default:
            return state
    }
}

function onMount() {
    const pos = {
        resume: 'top',
        skills: 'left',
        about: 'right',
        projects: 'bottom',
        socials: 'back',
        intro: 'front',
    }[(window.location.pathname.split('/')[1] || 'intro').toLowerCase()]

    return rotation({
        top: 'resume',
        left: 'skills',
        right: 'about',
        bottom: 'projects',
        back: 'socials',
        front: 'intro',
        history: [],
        checkpoints: [],
        correct: false
    }, { type: pos })
}

const origin = {
    ...onMount(),
    secretLength: secret.length
}