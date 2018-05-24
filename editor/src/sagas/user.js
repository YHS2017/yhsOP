import { fork, put, take, takeEvery, select } from 'redux-saga/effects';
import Api from './api';
import config from '../config';
import { setAppLoading, setAppMessage, setAppAlert, setAppConfirm } from './app';
import AppError, { AppErrorCode } from './AppError';

export function* getToken() {
  return yield select(store => store.user.token);
}

function* getUser() {
  return yield select(store => store.user);
}

function* getphonemsgCookie() {
  return yield select(store => store.user.phonemsg_cookie);
}

function* sendphonemsgLogin(action) {
  try {
    const result = yield Api.fetch(config.url + '/v1/auth/sendSMS', {
      method: 'POST',
      header: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: action.phone })
    });
    if (result.error === 0) {
      yield put({ type: 'SET_PHONEMSG_COOKIE', phonemsg_cookie: result.cookie });
      yield setAppMessage('发送验证码成功，请注意查收！');
    } else if (result.error === 1026) {
      console.log('短信渠道可能欠费，请检查是否需要充值！');
      yield setAppMessage('短信发送失败，重新尝试或使用其他登录方式！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
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

function* sendphonemsgBind(action) {
  try {
    yield setAppLoading('手机绑定中...');
    const token = yield getToken();
    const result = yield Api.fetch(config.url + '/v1/author/phone/verification-code', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({ phone: action.phone })
    });
    if (result.error === 0) {
      yield put({ type: 'SET_PHONEMSG_COOKIE', phonemsg_cookie: result.cookie });
      yield setAppMessage('发送验证码成功，请注意查收！');
    } else if (result.error === 1026) {
      console.log('短信渠道可能欠费，请检查是否需要充值！');
      yield setAppMessage('短信发送失败，重新尝试或使用其他登录方式！');
    } else if (result.error === 1024) {
      yield setAppConfirm('该手机账户已存在，请用手机号登录，或更换手机号重新再试！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-Phone' });
      return null
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
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
  } finally {
    yield setAppLoading(null);
  }
}

function* watchSendPhonemsg() {
  yield takeEvery('SEND_PHONEMSG_LOGIN', sendphonemsgLogin);
  yield takeEvery('SEND_PHONEMSG_BIND', sendphonemsgBind);
}

function* checkOldPhone(action) {
  try {
    const token = yield getToken();
    const cookie = yield getphonemsgCookie();
    const result = yield Api.fetch(config.url + '/v1/author/phone/verify-old', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({
        cookie: cookie,
        verificationCode: action.code
      })
    });
    if (result.error === 0) {
      yield setAppMessage('验证成功！');
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-Account-NewPhone' });
    } else if (result.error === 1025) {
      yield setAppMessage('验证码错误！');
      return null;
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
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
  } finally {
    yield setAppLoading(null);
  }
}

function* watchCheckOldPhone() {
  yield takeEvery('CHECK_OLDPHONE', checkOldPhone);
}

function* phoneBind(action) {
  try {
    const token = yield getToken();
    const cookie = yield getphonemsgCookie();
    const result = yield Api.fetch(config.url + '/v1/author/phone/verify', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify({
        cookie: cookie,
        verificationCode: action.code
      })
    });
    if (result.error === 0) {
      yield setAppMessage('绑定成功！');
      yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-List' });
    } else if (result.error === 1025) {
      yield setAppMessage('验证码错误！');
      return null;
    } else if (result.error === 1024) {
      yield setAppConfirm('该手机账户已存在，请用手机号登录，或更换手机号重新再试！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-Phone' });
      return null;
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.NetworkError:
          yield setAppMessage('网络错误，请检查网络后再试！');
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
  } finally {
    yield setAppLoading(null);
  }
}

function* watchphoneBind() {
  yield takeEvery('PHONE_BIND', phoneBind);
}

function* phoneLogin(code) {
  const cookie = yield getphonemsgCookie();
  const result = yield Api.fetch(config.url + '/v1/auth/loginSMSVerify', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_data: "string",
      cookie: cookie,
      domain: "phone",
      server_id: "string",
      uin: "string",
      verificationCode: code
    })
  });
  if (result.error === 0) {
    yield setAppMessage('登陆成功！');
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
    }
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  } else if (result.error === 1025) {
    yield setAppMessage('验证码错误！');
    return null;
  }
}

function* wxLogin(wxcode) {
  const result = yield Api.fetch(config.url + '/v1/auth/login', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "editor_weixin",
      ticket: wxcode,
      server_id: "0",
      extra: "",
      app_data: ""
    })
  });
  if (result.error === 0) {
    yield setAppMessage('登陆成功！');
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
    }
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  } else {
    yield setAppAlert('微信登录失败，请重新扫码登录！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-WeiXin' });
    return null
  }
}

function* qqLogin(qqcode) {
  const result = yield Api.fetch(config.url + '/v1/auth/login', {
    method: 'POST',
    header: { "Content-Type": "application/json" },
    body: JSON.stringify({
      domain: "editor_qq",
      uin: "",
      ticket: qqcode,
      server_id: "0",
      extra: "",
      app_data: ""
    })
  });
  if (result.error === 0) {
    yield setAppMessage('登陆成功！');
    const user = {
      id: result.user_id,
      name: result.user_name,
      profile: result.user_profile,
      token: result.token,
      phone: result.phone,
      qq: result.qq,
    }
    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  } else {
    yield setAppAlert('qq登录失败，请重新扫码登录！', { type: 'NAVIGATE_TO_ROUTER', router: 'Login-QQ' });
    return null
  }
}

function* watchLogin() {
  while (true) {
    try {
      const action = yield take(['LOGIN_WITH_PHONE', 'LOGIN_WITH_WEIXIN', 'LOGIN_WITH_QQ', 'LOGIN_WITH_SESSION']);
      let user = null;
      yield setAppLoading('正在登录......');
      switch (action.type) {
        case 'LOGIN_WITH_PHONE':
          user = yield phoneLogin(action.code);
          break;

        case 'LOGIN_WITH_WEIXIN':
          user = yield wxLogin(action.wxcode);
          break;

        case 'LOGIN_WITH_QQ':
          user = yield qqLogin(action.qqcode);
          break;

        case 'LOGIN_WITH_SESSION':
          user = action.user;
          break;

        default:
          break;
      }

      if (user) {
        yield put({
          type: 'LOGGED_IN',
          id: user.id,
          name: user.name,
          profile: user.profile,
          token: user.token,
          qq: user.qq,
          phone: user.phone,
        });
        if (user.phone === '') {
          yield setAppMessage('为了您的账号安全，需要绑定手机！');
          yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Login-PhoneBind' });
        } else {
          yield put({ type: 'NAVIGATE_TO_ROUTER', router: 'Home-List' });
          yield put({ type: 'REQUEST_MSGS', index: 0, pagecapacity: 10 });
          yield put({ type: 'REQUEST_NOTICES', index: 0, pagecapacity: 10 });
          yield put({ type: 'UPDATE_MSGSNOTICES' });
        }
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
    } finally {
      yield setAppLoading(null);
    }
  }
}

function* updateUser(action) {
  try {
    yield setAppLoading('正在修改资料.....');
    const token = yield getToken();
    const result = yield Api.fetch(config.url + '/v1/author/author_info', {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Authorization": token },
      body: JSON.stringify(action.user)
    });
    if (result.error === 0) {
      yield setAppMessage('资料修改成功！');
      yield put({ type: 'UPDATE_USER_INFO', user: action.user });
      const userinfo = yield getUser();
      sessionStorage.setItem('user', JSON.stringify(userinfo));
    } else if (result.error === 1225) {
      yield setAppMessage('资料修改失败，笔名只能30天修改一次！');
    } else if (result.error === 1226) {
      yield setAppMessage('资料修改失败，该笔名一已存在！');
    } else {
      yield setAppMessage('资料修改失败，请稍后重新尝试！');
    }
  } catch (e) {
    if (e instanceof AppError) {
      switch (e.code) {
        case AppErrorCode.InvalidToken:
          yield setAppAlert('登录信息失效，请重新登录！', { type: 'LOGOUT' });
          break;

        default:
          break;
      }
    } else {
      yield setAppMessage('未知错误，请重新尝试！');
    }
  } finally {
    yield setAppLoading(null);
  }
}

function* watchUpdateUser() {
  yield takeEvery('UPDATE_USER', updateUser);
}

function* watchLogout() {
  yield takeEvery('LOGOUT', logout);
}

function* logout() {
  sessionStorage.setItem('user', '');
  yield put({ type: 'LOGGED_OUT' });
  yield put({ type: 'INIT_PROJECTS' });
  yield put({ type: 'CLEAR_EDITOR' });
  yield put({ type: 'INIT_APP' });
  window.location.href = window.location.href.replace(window.location.search, '');
}

export default function* user() {
  yield fork(watchLogin);
  yield fork(watchLogout);
  yield fork(watchphoneBind);
  yield fork(watchUpdateUser);
  yield fork(watchSendPhonemsg);
  yield fork(watchCheckOldPhone);
}