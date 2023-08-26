import * as consts from "./const"

export function rotateCube(pos) {
    return dispatch => {
        dispatch({ pos, type: consts.CUBE_ROT })
    }
}

export function checkAchievement(name, value) {
    console.log(name, value);
    return dispatch => {
        dispatch({ name, value, type: consts.ACHIEVEMENT_CHECK })
    }
}

export function updateAchievementQueue(aniState) {
    return dispatch => {
        dispatch({ aniState, type: consts.ACHIEVEMENT_QUEUE_UPDATE })
    }
}

export function removeAchievementQueue() {
    return dispatch => {
        dispatch({ type: consts.ACHIEVEMENT_REMOVE_QUEUE })
    }
}