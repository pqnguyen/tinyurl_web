import {toFailure, toRequest, toSuccess} from "src/utils/createAction";
import {CREATE_FREE_SHORTEN_URL} from "src/redux/actionType/homeActionTypes";

const initialState = {
    isWaiting: false,
    originalUrl: '',
    shortenUrl: ''
};

function homeReducer(state = initialState, action) {
    let {message} = action.response || '';
    switch (action.type) {
        case toRequest(CREATE_FREE_SHORTEN_URL):
            return {
                ...state,
                isWaiting: true
            };
        case toSuccess(CREATE_FREE_SHORTEN_URL):
            return {
                ...state,
                isWaiting: false,
                originalUrl: message.original_url,
                shortenUrl: message.tiny_url,
            };
        case toFailure(CREATE_FREE_SHORTEN_URL):
            return {
                ...state,
                isWaiting: false
            }
        default:
            return state
    }
}

export default homeReducer;