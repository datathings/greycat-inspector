import { InputGroup, InputGroupButton, InputGroupAddon, Input, Button } from 'reactstrap';
import * as React from 'react';
import AppState from './AppState';
import { Graph, GraphBuilder } from 'greycat';
import { WSClient } from 'greycat-websocket';
import { withRouter } from 'react-router-dom';
import { History } from 'history';

class Connect extends React.Component<{ appState: AppState }, {}> {

    graphConnect(appState: AppState, history: History, target: string) {
        AppState.setConnectionLink(appState.url);
        const graph: Graph = GraphBuilder.newBuilder().withStorage(new WSClient('ws://' + appState.url + '/ws')).build();
        graph.connect((result) => {
            if (result === true) {
                appState.graph = graph;
                history.push(target);
            }
        });
    }

    render() {
        const ConnectToTask = withRouter(({ history }) => (
            <Button color="info" onClick={() => { this.graphConnect(this.props.appState, history, '/graph'); }}>Task</Button>
        ));
        const ConnectToBrowse = withRouter(({ history }) => (
          <Button color="info" onClick={() => { this.graphConnect(this.props.appState, history, '/browser'); }}>Browse</Button>
        ));
        return (
            <div className="jumbotron jumbotron-fluid">
                <div className="container">
                    <div className="row">
                        <InputGroup>
                            <InputGroupAddon>GreyCat Gateway</InputGroupAddon>
                            <Input name="url" placeholder="IP:PORT" defaultValue={this.props.appState.url} onChange={(event) => { this.props.appState.url = event.target.value; }} />
                            <InputGroupButton>
                                <ConnectToTask />
                                <ConnectToBrowse />
                            </InputGroupButton>
                        </InputGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default Connect;
