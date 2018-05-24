// @flow

export const AppErrorCode = {
    // 通用模块
    NetworkError: -1,       // 此Error需要提供服务器返回的http status
    UnknownError: -100,
    Success: 0,
    InvalidToken: 401,
    InvalidParameter: 403,
    InvalidJson: 400,

    // 编辑器操作异常
    InvalidOperation: 201,
};

export default class AppError {
    constructor(code, extra) {
        let message = `Error: ${code}`;
        if (extra) {
            message += `\n${extra}`;
        }
        this.message = message;
        this.extra = extra;
        this.code = code;
        this.stack = (new Error()).stack;
    }
}
AppError.prototype = new Error();
AppError.prototype.name = 'AppError';


