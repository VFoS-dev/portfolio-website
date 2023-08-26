import { ACHIEVEMENT_CHECK, ACHIEVEMENT_QUEUE_UPDATE, ACHIEVEMENT_REMOVE_QUEUE } from "../_actions/const";
import { STORE_ACHIEVEMENTS } from "../_actions/storage";
import { achievementsData } from "../_data/AchievementData";

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
    const { validate, data, ...achiData } = achievementsData[name];

    let didUpdate = validation[validate]({ data, name, value });

    // save state if a new achievement has been unlocked
    if (didUpdate) {
        let achievements = { dbKey: progress.dbKey }
        Object.keys(progress).forEach(v => { if (progress[v] instanceof Date) achievements[v] = progress[v] });
        localStorage.setItem(STORE_ACHIEVEMENTS, JSON.stringify(achievements));
    }

    return { didUpdate, newAchievement: { ...achiData, aniState: 'notify' } };
}

class validation {
    static ifnot({ name }) {
        if (progress[name] instanceof Date) return;
        progress[name] = new Date();
        return true;
    }
    static ifall({ name, data, value }) {
        if (progress[name] instanceof Date) return;
        if (!progress[name]) progress[name] = data;
        let set = new Set(progress[name]);
        set.delete(value);
        progress[name] = [...set];
        if (progress[name].length) return;
        progress[name] = new Date();
        return true;
    }
    static ifin({ name, data, value }) {
        if (progress[name] instanceof Date) return;
        if (!data.includes(value)) return;
        progress[name] = new Date();
        return true;
    }
    static ifless({ name, data, value }) {
        if (progress[name] instanceof Date) return;
        if (data < value) return;
        progress[name] = new Date();
        return true;
    }
    static ifmore({ name, data, value }) {
        if (progress[name] instanceof Date) return;
        if (data > value) return;
        progress[name] = new Date();
        return true;
    }
    static ifallfalse({ name, value }) {
        if (progress[name] instanceof Date) return;
        if (value.includes(true)) return;
        progress[name] = new Date();
        return true;
    }
}