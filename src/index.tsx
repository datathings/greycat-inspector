import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router';

//import TaskEditor from './TaskEditor';
// import AppState from './AppState';
//import Connect from './Connect';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

// const appState =  new AppState();
// <TaskEditor appState={appState} />


var Home = React.createClass({
  render: function() {
    return (<h1>Welcome to the Home Page</h1>);
  }
});

ReactDOM.render(
  (<Router>
      <Route path="/" component={Home} />
      <Route path="/users" component={Home} />
      <Route path="/widgets" component={Home} />
    </Router>
  ),
    document.getElementById('root') as HTMLElement
);
