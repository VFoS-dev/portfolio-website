import { combineReducers } from 'redux';

import { rotation } from './rotation';
import { achievements } from './achievements';

const rootReducer = combineReducers({
    achievements,
    rotation,
});

export default rootReducer;