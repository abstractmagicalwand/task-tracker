require('./css/main.css');
import React    from 'react';
import ReactDOM from 'react-dom';
import App      from './js/component/app.jsx';

window.localStorage.clear();
ReactDOM.render(<App />, document.getElementById('root'));