import { ACHIEVEMENT_CHECK, ACHIEVEMENT_QUEUE_UPDATE, ACHIEVEMENT_REMOVE_QUEUE, CUBE_ROT } from "../_constants/const"

export function rotateCube(pos) {
    return dispatch => {
        dispatch({ pos, type: CUBE_ROT })
    }
}

export function checkAchievement(aName, value) {
    return dispatch => {
        dispatch({ aName, value, type: ACHIEVEMENT_CHECK })
    }
}

export function updateAchievementQueue(aniState) {
    return dispatch => {
        dispatch({ aniState, type: ACHIEVEMENT_QUEUE_UPDATE })
    }
}

export function removeAchievementQueue(aniState) {
    return dispatch => {
        dispatch({ type: ACHIEVEMENT_REMOVE_QUEUE })
    }
}
