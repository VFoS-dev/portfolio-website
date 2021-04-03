export function rotation(state = origin, action) {
    switch (action.type) {
        case 'right':
            return {
                right: state.back,
                left: state.front,
                back: state.left,
                front: state.right,

                top: state.top,
                bottom: state.bottom
            };
        case 'bottom':
            return {
                bottom: state.back,
                top: state.front,
                front: state.bottom,
                back: state.top,

                left: state.left,
                right: state.right
            };
        case 'top':
            return {
                top: state.back,
                bottom: state.front,
                back: state.bottom,
                front: state.top,

                left: state.left,
                right: state.right
            };
        case 'left':
            return {
                left: state.back,
                right: state.front,
                back: state.right,
                front: state.left,

                top: state.top,
                bottom: state.bottom
            };
        case 'back':
            return {
                back: state.front,
                front: state.back,
                top: state.bottom,
                bottom: state.top,

                right: state.right,
                left: state.left
            };
        default:
            return state
    }
}

const origin = {
    top: 'education',
    left: 'resume',
    right: 'about',
    bottom: 'projects',
    back: 'contact',
    front: 'intro'
}