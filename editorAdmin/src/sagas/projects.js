import { fork, takeEvery, put, select } from 'redux-saga/effects';
import Api from './api';
import config from '../config';
import { setAppLoading, setAppAlert } from './app';
import AppError, { AppErrorCode } from './AppError';

function* getToken() {
  return yield select(store => store.user.token);
}

function* requestProjects(action) {
  try {
    yield setAppLoading('正在获取剧本列表...');
    const token = yield getToken();
    const result = yield Api.fetch(config.url + '/v1/admin/simple_reviewing_projects/' + action.status, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": token }
    });
    if (result.error === 0) {
      const list = result.simple_reviewing_projects;
      yield put({
        type: 'RESPONSE_PROJECTS',
        list: list,
        listtype: action.status,
      });
    } else {
      yield setAppAlert('获取剧本列表数据失败,请尝试刷新页面！', null);
      console.log('发生了未知错误！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppAlert('网络错误，请检查网络后再试！', null);
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
          yield setAppAlert('未知错误，请刷新后再试！', null);
          break;

        default:
          break;
      }
    } else {
      console.log('发生了未知错误！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchRequestProjects() {
  yield takeEvery('REQUEST_PROJECTS', requestProjects);
}

export default function* projects() {
  yield fork(watchRequestProjects);
}