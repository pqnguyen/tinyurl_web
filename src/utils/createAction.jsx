import {message} from "antd";

import config from "../configs/configs";
import {buildSearchString} from "./utils";

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const toRequest = type => `${type}_REQUEST`;
const toSuccess = type => `${type}_SUCCESS`;
const toFailure = type => `${type}_FAILURE`;

const makeAction = transform => (
    {type, payload, meta},
    response
) => ({
    type: transform(type),
    response,
    request: payload,
    meta: {
        ...(meta || {}),
        waiting: transform === toRequest
    }
});

const makeRequestAction = makeAction(toRequest);
const makeSuccessAction = makeAction(toSuccess);
const makeFailureAction = makeAction(toFailure);

const makeRequestUrl = ({request, isAuth, absolute}) => {
    if (absolute) {
        return request;
    }
    const apiUrl = "BACKEND_URL";

    return config[apiUrl] + request;
};

const makeFormDataFromJson = object => {
    if (object instanceof FormData) {
        return object;
    }

    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value, value.name);

            return;
        }

        formData.append(key, value);
    });

    return formData;
};

const makeFetchParams = ({method, body, headers: requiredHeaders}) => {
    const headers = {
        ...requiredHeaders,
    };

    const hasJSONBody = !!body && !(body instanceof FormData || body instanceof URLSearchParams);

    if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    return {
        body: hasJSONBody ? JSON.stringify(body) : body,
        headers,
        method: method || "GET",
        credentials: "same-origin",
    };
};

const handleJson = response => {
    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

const getResponseHeader = response => {
    if (isLocalhost) {
        return {};
    }

    const contentDisposition = response.headers.get('content-disposition');

    if (!contentDisposition) {
        throw new Error("Can not download file. Please check with IT team");
    }

    return contentDisposition
        .split(';')
        .map(x => x.split('='))
        .filter(kvArr => kvArr.length > 1) // avoiding `a=1; ; b=2`
        .reduce((res, [key, value]) => ({...res, [key.trim()]: value.trim()}), {});
};

const parseFileBlob = async response => {
    if (response.ok) {
        return {
            blob: await response.blob(),
            headers: getResponseHeader(response)
        }
    }

    throw new Error("Network response was not OK.");
};

const handleSaveFile = ({blob, headers}) => {
    const fileName = headers.filename || "admin-giigaa.xlsx";
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = `${fileName}`;
    a.click();
    window.URL.revokeObjectURL(url);
};

const validateResponse = response => {
    if (response.status !== 200) {
        throw new Error(response.code);
    }

    return response;
};

const createAsyncAction = action => async dispatch => {
    const {payload, onSuccess, onFail} = action;

    if (!payload || typeof payload.request !== "string") {
        console.error("The request url not exist");
        return false;
    }

    dispatch(makeRequestAction(action));

    const {request, method, body, params, headers, options, absolute = false, isDownload = false, isUpload = false} = payload;

    const urlParams = buildSearchString(params);

    try {
        if (isDownload) {
            await fetch(
                makeRequestUrl({request, ...options, absolute}) + urlParams,
                makeFetchParams({method, body, headers})
            ).then(parseFileBlob).then(handleSaveFile);

            return;
        }

        const bodyData = isUpload ? makeFormDataFromJson(body) : body;

        const response = await fetch(
            makeRequestUrl({request, ...options, absolute}) + urlParams,
            makeFetchParams({method, body: bodyData, headers})
        )
            .then(handleJson)
            .then(validateResponse);

        dispatch(makeSuccessAction(action, response));

        if (typeof onSuccess === "function") {
            onSuccess(response, dispatch);
        }

    } catch (error) {
        if (error.message === "error_access_token") {  //TODO: This is hot fix, we need refactor this one later

            setTimeout(() => {
                window.location.reload(true);
            }, 1500); // Default message.error auto-dismiss after 1500ms

            return;
        }

        if (typeof onFail === "function") {
            onFail(error.message);
        }
        dispatch(makeFailureAction(action, {reply: error.message}));
    }
};

const createAction = action => dispatch => {
    const {type, payload, meta = {}, onSuccess} = action;

    if (!payload) {
        console.error("The payload is not empty");
        return false
    }

    dispatch({type, payload, meta});

    if (typeof onSuccess === "function") {
        onSuccess({dispatch})
    }
};

export {toSuccess, toRequest, toFailure, createAsyncAction, createAction};
