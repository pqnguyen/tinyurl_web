import {compose} from "redux";

import config from "src/configs/configs";
import {callRequest} from "src/utils/request";

const toRequest = type => `${type}_REQUEST`;
const toSuccess = type => `${type}_SUCCESS`;
const toError = type => `${type}_ERROR`;

const makeAction = transform => (
    {type, payload, meta},
    response
) => ({
    type: transform(type),
    payload: response || payload,
    meta: {...(meta || {})}
});

const makeRequestAction = makeAction(toRequest);
const makeSuccessAction = makeAction(toSuccess);
const makeErrorAction = makeAction(toError);

const attachDeviceType = ({params}) => ({
    params: {
        ...params,
        device_type: "DESKTOP"
    }
});

const metaHandlers = {
    attachDeviceType
};

const onlyTrue = options => ([handlerName]) => options[handlerName];

const attachMetaOptions = (defaultParams, {options = {}}) => {
    if (!Object.keys(options).length) {
        return {...defaultParams};
    }

    const handlers = Object.entries(metaHandlers)
        .filter(onlyTrue(options))
        .map(([, func]) => func);
    const mainHandler = compose(...handlers);
    const {params} = mainHandler({params: {...defaultParams}});

    return {...params};
};

const makeRequestUrl = ({request, isAuth, absolute}) => {
    if (absolute) {
        return request;
    }
    const apiUrl = isAuth ? "AUTH_ROOT_URL" : "WEB_ONLINE_ROOT_URL";

    return config[apiUrl] + request;
};

const makeFetchParams = ({method, body, params, headers: optionHeaders, options}) => {
    const hasJsonBody = !!body;

    const headers = {
    };  // TODO: Need to update the BaseHeader when required by the API

    if (hasJsonBody) {
        headers["Content-Type"] = "application/json; charset=UTF-8";
    }

    const paramsWithMeta = attachMetaOptions(params, {options});

    return {
        headers,
        params: paramsWithMeta,
        method: method || "GET",
        credentials: "same-origin",
        body: hasJsonBody ? JSON.stringify(body) : body,
    };
};

const validateResponse = (response, absolute) => {
    if (!absolute) {
        if (response.result !== "success") {
            throw new Error(JSON.stringify(response));
        }
    }

    return response;
};

const parseJsonResponse = str => {
    if (typeof str !== "string") {
        return {};
    }

    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};

const createAsyncAction = action => async (dispatch, getState) => {
    const {payload, onSuccess, onError} = action;

    if (!payload || typeof payload.request !== "string") {
        console.error("The request url not exist");
        return false;
    }

    dispatch(makeRequestAction(action));

    const {request, method, body, params, options, headers, absolute = false} = payload;

    try {
        const url = makeRequestUrl({request, ...options, absolute});
        const paramsToBeSent = makeFetchParams({method, body, params, headers, options});

        const response = await callRequest({...paramsToBeSent, url});

        validateResponse(response, absolute);

        if (typeof onSuccess === "function") {
            onSuccess(dispatch, response);
        }

        return dispatch(makeSuccessAction(action, response));
    } catch (error) {
        // Handle error network with jQuery https://stackoverflow.com/questions/1730692/jquery-ajax-how-to-detect-network-connection-error-when-making-ajax-call
        if (error.readyState === 0) {
            console.error("Kết nối mạng bị gián đoạn, vui lòng thử lại sau");

            return;
        }

        const response = parseJsonResponse(error.message);

        if (typeof onError === "function") {
            onError(dispatch, response, getState);
        }

        return dispatch(makeErrorAction(action, response));
    }
};

const createAction = action => (dispatch, getState) => {
    const {type, payload = {}, meta = {}, onSuccess} = action;

    try {
        dispatch({type, payload, meta});

        if (typeof onSuccess === "function") {
            onSuccess(dispatch, getState);
        }
    } catch (error) {
        console.exception(error, {
            action
        });
    }
};

export {
    createAsyncAction,
    createAction,
    toSuccess,
    toRequest,
    toError,
    makeRequestAction,
    makeSuccessAction,
    makeErrorAction
};
