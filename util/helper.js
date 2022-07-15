// JSON success reposonse
exports.successResponse = (res, responseMessage, responseResult, responseCode) => {
    res.status(responseCode).json({
        'success' : true,
        'message' : responseMessage,
        'result'  : responseResult,
        'serverdatetime' : new Date().toJSON(),
        'db_version' : '1.0',
        'http_code' : responseCode
    });
};

// JSON failure response
exports.failureResponse = (res, errorMessage, errorResult, responseCode) => {
    res.status(responseCode).json({
        'success' : false,
        'message' : errorMessage,
        'result' : errorResult,
        'http_code' : responseCode
    });
};