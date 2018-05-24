import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import 'font-awesome/css/font-awesome.min.css';
import './css/index.css';
import App from './components/App';
import reducers from './reducers';
import sagas from './sagas';
// import registerServiceWorker from './registerServiceWorker';

// 因为Saga启动失败的日志在Chrome会被清空，所以延迟500毫秒再显示错误日志
// const options = {onError: (e) => setTimeout(() => console.error(e), 500)};
const sagaMiddleware = createSagaMiddleware();
const store = createStore(combineReducers(reducers), applyMiddleware(sagaMiddleware));
sagaMiddleware.run(sagas);

ReactDOM.render(
    <Provider store={store}>
        {/* <App onLoad={() => sagaMiddleware.run(sagas)} /> */}
        <App />
    </Provider>,
    document.getElementById('root')
);
// registerServiceWorker();