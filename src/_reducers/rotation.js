export function rotation(state = origin, action) {
    var secret = process.env.secret || '["right","bottom","bottom","bottom","right","top","top","top","right","right"]';
    var history = state.history;
    var check = [];

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
        default:
            break;
    }

    history.forEach((c, index) => check.push(JSON.parse(secret)[index] == c))

    // console.log(history, check, 10 === check.reduce((a, b) => a + b, 0));
    switch (action.type) {
        case 'right':
            return {
                right: state.back,
                left: state.front,
                back: state.left,
                front: state.right,

                top: state.top,
                bottom: state.bottom,
                history: history
            };
        case 'bottom':
            return {
                bottom: state.back,
                top: state.front,
                front: state.bottom,
                back: state.top,

                left: state.left,
                right: state.right,
                history: history
            };
        case 'top':
            return {
                top: state.back,
                bottom: state.front,
                back: state.bottom,
                front: state.top,

                left: state.left,
                right: state.right,
                history: history
            };
        case 'left':
            return {
                left: state.back,
                right: state.front,
                back: state.right,
                front: state.left,

                top: state.top,
                bottom: state.bottom,
                history: history
            };
        case 'back':
            return {
                back: state.front,
                front: state.back,
                top: state.bottom,
                bottom: state.top,

                right: state.right,
                left: state.left,
                history: history
            };
        default:
            return state
    }
}

const origin = {
    top: 'skills',
    left: 'resume',
    right: 'about',
    bottom: 'projects',
    back: 'contact',
    front: 'intro',
    history: []
}