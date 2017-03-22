import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TaskEditor from './TaskEditor';
import AppState from './AppState';
import './index.css';

const appState =  new AppState();

ReactDOM.render(
    <TaskEditor appState={appState} />,
    document.getElementById('root') as HTMLElement
);
