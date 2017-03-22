import * as React from 'react';
import './App.css';
import { Router, Route, hashHistory } from 'react-router'

console.log(hashHistory);

class App extends React.Component<null, null> {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path='/' component={Home} />
                <Route path='/address' component={Address} />
            </Router>
        );
    }
}

const Home = () => <h1>Hello from Home!</h1>
const Address = () => <h1>We are located at 555 Jackson St.</h1>

export default App;
