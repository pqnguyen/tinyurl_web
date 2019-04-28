import {combineReducers} from 'redux';
import HomeReducer from 'src/pages/Home/HomeReducer'
import hashReducer from "../pages/Hash/HashReducer";

const rootReducer = combineReducers({
    home: HomeReducer,
    hash: hashReducer
});

export default rootReducer;
