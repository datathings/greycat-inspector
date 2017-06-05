import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.min.css';

import TaskEditor from './TaskEditor';
import AppState from './AppState';
import Connect from './Connect';
import ReflexiveBrowser from './ReflexiveBrowser';

const appState =  new AppState();
const ConnectPage = () => <Connect appState={appState} />;
const MainPage = () => <TaskEditor appState={appState} />;
const Browser = () => <ReflexiveBrowser appState={appState} />;

ReactDOM.render((
  <Router>
    <div>
        <Route exact={true} path="/" component={ConnectPage} />
        <Route path="/graph" component={MainPage} />
        <Route path="/browser" component={Browser} />
    </div>
</Router>
), document.getElementById('root') as HTMLElement);
