import { put } from 'redux-saga/effects';
import Api from './api';

const notice = {
    getnotice: function* () {
        const datastr = yield Api.fetch('../../notice.json');
        const data = JSON.parse(datastr);
        yield put({ type: 'SET_NOTICE', notice: data });
    }
}

export default notice;