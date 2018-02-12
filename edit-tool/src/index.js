import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './reducers';
import 'bootstrap/dist/css/bootstrap.css';
import './components/css/index.css';
import App from './components/js/App';
//import registerServiceWorker from './registerServiceWorker';

let store = createStore(reducer);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
//registerServiceWorker();
