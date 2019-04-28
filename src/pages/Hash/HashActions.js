import {REDIRECT_URL} from 'src/redux/actionType/homeActionTypes'
import {createAsyncAction} from "src/utils/createAction";

export function redirectUrl(hash) {
    return createAsyncAction({
        type: REDIRECT_URL,
        payload: {
            request: `/${hash}`,
            method: 'GET',
        }
    });
}