import { fork, put, take, takeEvery, select } from 'redux-saga/effects';
import Api from './api';
import config from '../config';
import { setAppLoading, setAppMessage, setAppAlert } from './app';
import AppError, { AppErrorCode } from './AppError';

export function* getToken() {
  return yield select(store => store.user.token);
}

function* Login(acc, pwd) {
  try {
    const result = yield Api.fetch(config.url + '/v1/admin/login', {
      method: 'POST',
      header: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: acc,
        password: pwd,
      })
    });
    if (result.error === 0) {
      yield setAppMessage('登陆成功！');
      const admin = {
        name: acc,
        token: result.token,
        level: result.authority_level,
      }
      sessionStorage.setItem('admin', JSON.stringify(admin));
      return admin;
    } else {
      yield setAppAlert('登录失败,用户名或密码错误！', null);
      console.log('发生了未知错误！');
      return null;
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
  }
}

function* watchLogin() {
  while (true) {
    try {
      const action = yield take(['LOGIN', 'LOGIN_WITH_SESSION']);
      let admin = null;
      yield setAppLoading('正在登录......');
      switch (action.type) {
        case 'LOGIN':
          admin = yield Login(action.acc, action.pwd);
          break;

        case 'LOGIN_WITH_SESSION':
          admin = action.admin;
          break;

        default:
          break;
      }

      if (admin) {
        yield put({
          type: 'LOGGED_IN',
          name: admin.name,
          token: admin.token,
          level: admin.level,
        });
        yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-List' });
        yield put({ type: 'REQUEST_NOTICES', index: 0, pagecapacity: 10 });
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
}


function* watchLogout() {
  yield takeEvery('LOGOUT', logout);
}

function* logout() {
  sessionStorage.setItem('admin', '');
  yield put({ type: 'LOGGED_OUT' });
  yield put({ type: 'INIT_PROJECTS' });
  yield put({ type: 'CLEAR_EDITOR' });
  yield put({ type: 'INIT_APP' });
  yield setAppMessage('已注销！');
}

export default function* user() {
  yield fork(watchLogin);
  yield fork(watchLogout);
}