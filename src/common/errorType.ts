export enum ERRORTYPES {
    JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR',
    BUSINESS_ERROR = 'BUSINESS_ERROR',
    LOG_ERROR = 'LOG_ERROR',
    FETCH_ERROR = 'HTTP_ERROR',
    RESOURCE_ERROR = 'RESOURCE_ERROR',
    PROMISE_ERROR = 'PROMISE_ERROR',
    VUE_ERROR = 'VUE_ERROR'
}

export enum ERRORNAMETYPES {
    jsError = 'JS_ERROR',
    sourceError = 'SOURCE_ERROR',
    promiseError = 'UNHANDLEDREJECTION',
    consoleError = 'CONSOLE_ERROR',
    ajaxError = 'AJAX_ERROR',
    fetchError = 'FETCH_ERROR',
    VueError = 'VueError'
}