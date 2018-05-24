import { call } from 'redux-saga/effects';
import AppError, { AppErrorCode } from './AppError';

const Api = {
  fetch: function* (url, options) {
    try {
      let result = yield call(fetch, url, options);
      if (!result.ok) {
        const error = new AppError(AppErrorCode.NetworkError);
        throw error;
      } else {
        let data = JSON.parse(yield call(() => result.text()));
        if (data.error === 401) {
          const error = new AppError(AppErrorCode.InvalidToken);
          throw error;
        } else if (data.error === 403) {
          const error = new AppError(AppErrorCode.InvalidParameter);
          throw error;
        } else if (data.error === 400) {
          const error = new AppError(AppErrorCode.InvalidJson);
          throw error;
        } else {
          return data;
        }
      }
    } catch (e) {
      if (e instanceof AppError) {
        throw e;
      } else {
        const error = new AppError(AppErrorCode.NetworkError);
        throw error;
      }
    }
  }
};

export default Api;