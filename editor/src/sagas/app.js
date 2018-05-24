import { fork, put, takeEvery, select } from 'redux-saga/effects';
import Api from './api';
import config from '../config';
import AppError, { AppErrorCode } from './AppError';
import { getToken } from './user';

function* getMsgs() {
    return yield select(store => store.app.msgs);
}

function* getNotread() {
    return yield select(store => store.app.notread);
}

export function* setAppLoading(content) {
    yield put({
        type: 'SET_APP_LOADING',
        loading: { content: content },
    });
}

export function* setAppMessage(content) {
    yield put({
        type: 'SET_APP_MESSAGE',
        message: {
            content: content,
        },
    })
}

export function* setAppAlert(content, cback) {
    yield put({
        type: 'SET_APP_ALERT',
        alert: {
            content: content,
            cback: cback,
        },
    })
}

export function* setAppConfirm(content, cback) {
    yield put({
        type: 'SET_APP_CONFIRM',
        confirm: {
            content: content,
            cback: cback,
        },
    })
}

function* RequestMsgs(action) {
    try {
        const token = yield getToken();
        const result = yield Api.fetch(config.url + '/v1/author/author_messages/' + action.index + '/' + action.pagecapacity, {
            method: 'GET',
            headers: { "Content-Type": "application/json", "Authorization": token }
        });
        if (result.error === 0) {
            const msgs = result.messages;
            const totalmsgs = result.rows;
            const notread = result.unread;
            yield put({
                type: 'SET_APP_MSGS',
                msgs,
                totalmsgs,
                notread
            });
        } else {
            console.log('发生了未知错误！');
        }
    } catch (e) {
        if (e instanceof AppError) {
            switch (e.code) {
                case AppErrorCode.NetworkError:
                    yield setAppMessage('网络错误，请检查网络后再试！');
                    break;

                case AppErrorCode.InvalidToken:
                    yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
                    break;

                case AppErrorCode.InvalidParameter:
                    console.log('请求参数错误，请检查请求参数后再试！');
                    break;

                case AppErrorCode.InvalidJson:
                    console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
                    break;

                case AppErrorCode.UnknownError:
                    yield setAppMessage('未知错误，请刷新后再试！');
                    break;

                default:
                    break;
            }
        } else {
            console.log('发生了未知错误！');
        }
    }
}

function* watchRequestMsgs() {
    yield takeEvery('REQUEST_MSGS', RequestMsgs);
}

function* RequestNotices(action) {
    try {
        const token = yield getToken();
        const result = yield Api.fetch(config.url + '/v1/author/notices/' + action.index + '/' + action.pagecapacity, {
            method: 'GET',
            headers: { "Content-Type": "application/json", "Authorization": token }
        });
        if (result.error === 0) {
            const notices = result.notices;
            const totalnotices = result.rows;
            yield put({
                type: 'SET_APP_NOTICES',
                notices,
                totalnotices
            });
        } else {
            console.log('发生了未知错误！');
        }
    } catch (e) {
        if (e instanceof AppError) {
            switch (e.code) {
                case AppErrorCode.NetworkError:
                    yield setAppMessage('网络错误，请检查网络后再试！');
                    break;

                case AppErrorCode.InvalidToken:
                    yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
                    break;

                case AppErrorCode.InvalidParameter:
                    console.log('请求参数错误，请检查请求参数后再试！');
                    break;

                case AppErrorCode.InvalidJson:
                    console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
                    break;

                case AppErrorCode.UnknownError:
                    yield setAppMessage('未知错误，请刷新后再试！');
                    break;

                default:
                    break;
            }
        } else {
            console.log('发生了未知错误！');
        }
    }
}

function* watchRequestNotices() {
    yield takeEvery('REQUEST_NOTICES', RequestNotices);
}

function* ReadMsg(action) {
    try {
        const token = yield getToken();
        const result = yield Api.fetch(config.url + '/v1/author/read_message/', {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify({ message_id: action.id })
        });
        if (result.error === 0) {
            const msgs = yield getMsgs();
            const notread = yield getNotread();
            for (let i = 0; i < msgs.length; i++) {
                msgs[i].is_read = true;
                break;
            }
            yield put({ type: 'SET_MSG_READ', msgs: [...msgs], notread: Math.max(notread - 1, 0) });
        } else {
            console.log('发生了未知错误！');
        }
    } catch (e) {
        if (e instanceof AppError) {
            switch (e.code) {
                case AppErrorCode.NetworkError:
                    console.log('网络错误，请检查网络后再试！');
                    break;

                case AppErrorCode.InvalidToken:
                    yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
                    break;

                case AppErrorCode.InvalidParameter:
                    console.log('请求参数错误，请检查请求参数后再试！');
                    break;

                case AppErrorCode.InvalidJson:
                    console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
                    break;

                case AppErrorCode.UnknownError:
                    console.log('未知错误，请刷新后再试！');
                    break;

                default:
                    break;
            }
        } else {
            console.log('发生了未知错误！');
        }
    }
}

function* watchReadMsg() {
    yield takeEvery('READ_MSG', ReadMsg);
}

function* ReadAllMsgs(action) {
    try {
        const token = yield getToken();
        const result = yield Api.fetch(config.url + '/v1/author/read_all_message/', {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify({ message_id: action.id })
        });
        if (result.error === 0) {
            yield put({ type: 'REQUEST_MSGS', index: 0, pagecapacity: 10 });
        } else {
            console.log('发生了未知错误！');
        }
    } catch (e) {
        if (e instanceof AppError) {
            switch (e.code) {
                case AppErrorCode.NetworkError:
                    console.log('网络错误，请检查网络后再试！');
                    break;

                case AppErrorCode.InvalidToken:
                    yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
                    break;

                case AppErrorCode.InvalidParameter:
                    console.log('请求参数错误，请检查请求参数后再试！');
                    break;

                case AppErrorCode.InvalidJson:
                    console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
                    break;

                case AppErrorCode.UnknownError:
                    console.log('未知错误，请刷新后再试！');
                    break;

                default:
                    break;
            }
        } else {
            console.log('发生了未知错误！');
        }
    }
}

function* watchReadAllMsgs() {
    yield takeEvery('READ_ALL_MSGS', ReadAllMsgs);
}

function* UpdateMsgsNotices() {
    try {
        const token = yield getToken();
        const result = yield Api.fetch(config.url + '/v1/author/author_keep/', {
            method: 'GET',
            headers: { "Content-Type": "application/json", "Authorization": token },
        });
        if (result.error === 0) {
            if (result.type === 'message') {
                yield put({ type: 'REQUEST_MSGS', index: 0, pagecapacity: 10 });
            } else {
                yield put({ type: 'REQUEST_NOTICES', index: 0, pagecapacity: 10 });
            }
            yield UpdateMsgsNotices();
        } else if (result.error === 504) {
            yield UpdateMsgsNotices();
        } else {
            console.log('发生了未知错误！');
        }
    } catch (e) {
        if (e instanceof AppError) {
            switch (e.code) {
                case AppErrorCode.NetworkError:
                    console.log('网络错误，请检查网络后再试！');
                    break;

                case AppErrorCode.InvalidToken:
                    yield setAppAlert('登录信息已过期，请重新登录！', { type: 'LOGOUT' });
                    break;

                case AppErrorCode.InvalidParameter:
                    console.log('请求参数错误，请检查请求参数后再试！');
                    break;

                case AppErrorCode.InvalidJson:
                    console.log('请求参数的Json格式有问题，请检查请求参数后再试！');
                    break;

                case AppErrorCode.UnknownError:
                    console.log('未知错误，请刷新后再试！');
                    break;

                default:
                    break;
            }
        } else {
            console.log('发生了未知错误！');
        }
    }
}

function* watchUpdateMsgsNotices() {
    yield takeEvery('UPDATE_MSGSNOTICES', UpdateMsgsNotices);
}

export default function* app() {
    yield fork(watchRequestMsgs);
    yield fork(watchRequestNotices);
    yield fork(watchReadMsg);
    yield fork(watchReadAllMsgs);
    yield fork(watchUpdateMsgsNotices);
}