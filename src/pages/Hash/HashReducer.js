import {toFailure, toRequest, toSuccess} from "src/utils/createAction";
import {REDIRECT_URL} from "src/redux/actionType/homeActionTypes";

const initialState = {
    isWaiting: false,
    originalUrl: '',
};

function hashReducer(state = initialState, action) {
    let {message} = action.response || '';
    switch (action.type) {
        case toRequest(REDIRECT_URL):
            return {
                ...state,
                isWaiting: true
            };
        case toSuccess(REDIRECT_URL):
            window.location.replace(message.original_url);
            return {
                ...state,
            };
        case toFailure(REDIRECT_URL):
            return {
                ...state,
                isWaiting: false
            };
        default:
            return state
    }
}

export default hashReducer;