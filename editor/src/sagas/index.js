import {fork, takeEvery} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import app from './app';
import user from './user';
import editor from './editor';
import projects from './projects';
import notice from './notice';

export default function* root() {
    yield fork(app);
    yield fork(user);
    yield fork(editor);
    yield fork(projects);
}