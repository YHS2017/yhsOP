import { fork, put, takeEvery, select } from 'redux-saga/effects';
import Api from './api';
import config from '../config';
import AppError, { AppErrorCode } from './AppError';
import { getToken } from './user';

function* getNotices() {
    return yield select(store => store.app.notices);
}

function* getTotalNotices() {
    return yield select(store => store.app.totalnotices);
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

function* saveNotice(action) {
    try {
        const token = yield getToken();
        const result = yield Api.fetch(config.url + '/v1/admin/editor_notice', {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": token },
            body: JSON.stringify(action.notice)
        });
        if (result.error === 0) {
            let notices = yield getNotices();
            let totalnotices = yield getTotalNotices();
            if (action.notice.id === 0) {
                notices.push(action.notice);
                totalnotices += 1
            } else {
                for (let i = 0; i < notices.length; i++) {
                    if (notices[i].id === action.notice.id) {
                        notices[i] = { ...action.notice }
                    }
                }
            }
            yield put({ type: 'SET_APP_NOTICES', notices: [...notices], totalnotices });
            yield put({ type: 'REQUEST_NOTICES', index: 0, pagecapacity: 10 });
            yield setAppMessage('公告保存成功！');
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

function* watchSaveNotice() {
    yield takeEvery('SAVE_NOTICE', saveNotice);
}


export default function* app() {
    yield fork(watchRequestNotices);
    yield fork(watchSaveNotice);
}