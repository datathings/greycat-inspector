import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TaskEditor from './TaskEditor';
import AppState from './AppState';
import './index.css';
import DevTools from 'mobx-react-devtools';

const appState =  new AppState();

ReactDOM.render(
    <div>
    <DevTools />
    <TaskEditor appState={appState} />
    </div>,
    document.getElementById('root') as HTMLElement
);
