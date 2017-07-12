import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import MainPage from './pages/MainPage';

ReactDOM.render((
  <Router>
    <div>
        <Route path="/" component={MainPage} />
    </div>
</Router>
), document.getElementById('root') as HTMLElement);
