import { ACHIEVEMENT_CHECK, ACHIEVEMENT_QUEUE_UPDATE, ACHIEVEMENT_REMOVE_QUEUE } from "../_actions/const";
import { STORE_ACHIEVEMENTS } from "../_actions/storage";

const init = {
    queue: []
};

// set up saved achievements
let progress = JSON.parse(localStorage.getItem(STORE_ACHIEVEMENTS)) || { dbKey: crypto.randomUUID().toString() }
for (const ac of Object.keys(progress)) if (ac != 'dbKey') progress[ac] = new Date(progress[ac]);

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

function checkAchievement(name, value) {
    let didUpdate = true, newAchievement;





    // save state if a new achievement has been unlocked
    if (didUpdate) {
        progress[name] = new Date();
        let achievements = { dbKey: progress.dbKey }
        Object.keys(progress).forEach(v => { if (progress[v] instanceof Date) achievements[v] = progress[v] })
        localStorage.setItem(STORE_ACHIEVEMENTS, JSON.stringify(achievements));
    }

    return { didUpdate, newAchievement };
}