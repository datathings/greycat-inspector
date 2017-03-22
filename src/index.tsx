import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

//import TaskEditor from './TaskEditor';
// import AppState from './AppState';
//import Connect from './Connect';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

// const appState =  new AppState();
// <TaskEditor appState={appState} />


ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
