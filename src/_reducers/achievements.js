import { ACHIEVEMENT_CHECK, ACHIEVEMENT_QUEUE_UPDATE, ACHIEVEMENT_REMOVE_QUEUE } from "../_actions/const";
import { STORE_ACHIEVEMENTS } from "../_actions/storage";
import { achievementsData } from "../_data/AchievementData";

const init = {
    queue: []
};

const validateState = (ani, def) => ['', 'notify', 'close'].includes(ani) ? ani : def;
export const getAchievements = () => progress;
export const hasAchievement = (id) => progress[id] instanceof Date;

export function clearAchievements() {
    progress = {};
    localStorage.removeItem(STORE_ACHIEVEMENTS);
}

// set up saved achievements
let progress = JSON.parse(localStorage.getItem(STORE_ACHIEVEMENTS)) || {}
for (const ac of Object.keys(progress))
    if (typeof progress[ac] === 'string')
        progress[ac] = new Date(progress[ac]);

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

function checkAchievement(name, value) {
    if (progress[name] instanceof Date) return {};
    if (!achievementsData[name]) {
        console.error('achievement not found', name);
        return {}
    }

    const { validate, data, ...achiData } = achievementsData[name];

    const [didUpdate, shouldSave] = validation[validate]({ data, name, value });

    // save state
    if (didUpdate || shouldSave)
        localStorage.setItem(STORE_ACHIEVEMENTS, JSON.stringify(progress));

    return { didUpdate, newAchievement: { ...achiData, aniState: 'notify', achievementName: name } };
}

class validation {
    static ifnot({ name }) {
        progress[name] = new Date();
        return [true];
    }
    static ifall({ name, data, value }) {
        if (!progress[name]) progress[name] = data;
        let set = new Set(progress[name]);
        set.delete(value);
        progress[name] = [...set];
        if (progress[name].length) return [false, true];
        progress[name] = new Date();
        return [true];
    }
    static ifin({ name, data, value }) {
        if (!data.includes(value)) return [];
        progress[name] = new Date();
        return [true];
    }
    static ifless({ name, data, value }) {
        if (data < value) return [];
        progress[name] = new Date();
        return [true];
    }
    static ifmore({ name, data, value }) {
        if (data > value) return [];
        progress[name] = new Date();
        return [true];
    }
    static ifallfalse({ name, value }) {
        if (value.includes(true)) return [];
        progress[name] = new Date();
        return [true];
    }
    static ifhasfalse({ name, value }) {
        if (!value.includes(false)) return [];
        progress[name] = new Date();
        return [true];
    }
    static otherAchievements({ name, data, value }) {
        if (!progress[name])
            progress[name] = (data === 'all') ?
                Object.keys(achievementsData).filter(a => a != name) :
                data;
        let set = new Set(progress[name]);
        set.delete(value);
        progress[name] = [...set];
        if (progress[name].length) return [false, true];
        progress[name] = new Date();
        return [true];
    }
}