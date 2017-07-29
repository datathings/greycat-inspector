import * as React from 'react';
import { Component } from 'react';
import Connection from '../core/Connection';
import { Col, Panel, Row } from 'react-bootstrap';
import { Graph, Node as GCNode } from '@greycat/greycat';
import GCNodeTree from './nav/GCNodeTree';
import NodeDetailsPanel from './panels/NodeDetailsPanel';
import NavigationContext from './nav/NavigationContext';

export interface GraphPanelProps {
  connection: Connection
}

export interface GraphPanelState {
  connectionState: number;
  graph?: Graph;
  selectedNode?: GCNode;
  navigationContext?: NavigationContext
}

class GraphPanel extends Component<GraphPanelProps, GraphPanelState> {

  public static CONNECTING: number = 0;
  public static CONNECTED: number = 1;
  public static FAILED: number = -1;

  constructor(props: GraphPanelProps) {
    super(props);
    this.state = {
      connectionState: GraphPanel.CONNECTING,
    }
  }

  componentDidMount() {
    this.props.connection.connect((_graph: Graph) => {
      if (_graph) {
        let treeCtx = new NavigationContext();
        treeCtx.graph = _graph;
        treeCtx.world = 0;
        treeCtx.time = (new Date()).getTime();
        treeCtx.onNodeSelected = (n: GCNode) => {
          this.setState({selectedNode: n});
        };
        this.setState({graph: _graph, navigationContext: treeCtx, connectionState: GraphPanel.CONNECTED});
      } else {
        this.setState({connectionState: GraphPanel.FAILED});
      }
    });
  }


  render() {

    let displayState = (this.state.connectionState === GraphPanel.CONNECTING ? 'Connecting' : (this.state.connectionState === GraphPanel.CONNECTED ? 'Connected' : 'Failed'));

    return (
      <div>
        <Panel header={<div><b>{this.props.connection.name}</b> {displayState}</div>}>
          <Row>
            <Col sm={6}>
              {(this.state.connectionState === GraphPanel.CONNECTED ?

                <GCNodeTree {...this.state.navigationContext}/> : null)}
            </Col>
            <Col sm={6}>
              <NodeDetailsPanel node={this.state.selectedNode}/>
            </Col>
          </Row>
        </Panel>
      </div>
    );
  }
}

export default GraphPanel;
