import {CREATE_FREE_SHORTEN_URL} from 'src/redux/actionType/homeActionTypes'
import {createAsyncAction} from "src/utils/createAction";

export function createFreeUrl(originalUrl) {
    return createAsyncAction({
        type: CREATE_FREE_SHORTEN_URL,
        payload: {
            request: "/create_free_url",
            method: 'POST',
            body: {
                url: originalUrl
            }
        }
    });
}