import $ from "jquery"

const callRequest = async ({url, headers, method, body, params, success, error, statusCode}) => {
    try {
        return await $.ajax({
            url,
            headers,
            data: body || params,
            crossDomain: true,
            type: method,
            success,
            error,
            statusCode,
        })
    } catch (e) {
        throw e
    }
}

export {
    callRequest
}
