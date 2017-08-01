import * as React from 'react';
import {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import InspectorState from '../core/InspectorState';
import ConnectionMenu from '../cmp/connections/ConnectionMenu';
import Connection from "../core/Connection";
import GraphPanel from "../cmp/GraphPanel";
import { Grid, Row } from 'react-bootstrap';


class MainPage extends Component<RouteComponentProps<{}>, { connections: Connection[], glConfig: any }> {

  private inspectorState: InspectorState = new InspectorState();

  constructor(props: RouteComponentProps<{}>) {
    super(props);
    this.state = {
      connections: [],
      glConfig: {}
    };
  }

  private listenerRef: number;

  componentDidMount() {
    this.listenerRef = this.inspectorState.listenPanelAdded((() => {
      this.setState({connections: this.inspectorState.connections});
    }).bind(this));
  }

  componentWillUnmount() {
    this.inspectorState.removePanelListener(this.listenerRef);
  }

  render() {
    return (
      <div>
        <ConnectionMenu inspectorState={this.inspectorState}/>
        <Grid>
          <Row>
            {this.state.connections.map((connection: Connection, idx: number) => {
              return <GraphPanel connection={connection}/>;
            })}
          </Row>
        </Grid>

      </div>);
  }
}

export default MainPage;
