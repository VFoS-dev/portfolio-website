import { ACHIEVEMENT_CHECK, ACHIEVEMENT_QUEUE_UPDATE, ACHIEVEMENT_REMOVE_QUEUE } from "../_constants/const";

const init = {
    queue: []
};

export function achievements(state = init, { type, ...action }) {
    let { queue } = state;

    switch (type) {
        case ACHIEVEMENT_CHECK:
            const { name, value } = action;
            const { didUpdate, newAchievement } = checkAchievement(name, value);
            if (didUpdate) {
                queue.push(newAchievement);
                return { ...state, queue };
            }
            break;
        case ACHIEVEMENT_QUEUE_UPDATE:
            const { aniState } = action;
            if (queue.length) {
                queue[0].aniState = validateState(aniState, queue[0].aniState);
                return { ...state, queue };
            }
            break;
        case ACHIEVEMENT_REMOVE_QUEUE:
            if (queue.length) {
                queue.shift();
                return { ...state, queue };
            }
            break;
    }

    return state;
}

const validateState = (ani, def) => ['', 'notify', 'close'].includes(ani) ? ani : def;

let achievementProgress = localStorage.getItem('achievements') || {}

function checkAchievement(name, value) {
    let didUpdate = false, newAchievement;


    return { didUpdate, newAchievement };
}