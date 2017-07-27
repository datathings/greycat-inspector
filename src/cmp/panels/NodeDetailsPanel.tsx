
import * as React from 'react';
import { Component } from 'react';
import {Node as GCNode} from 'greycat';
import { Panel } from 'react-bootstrap';

interface NodeDetailsPanelProps {
  node: GCNode;
}

class NodeDetailsPanel extends Component<NodeDetailsPanelProps,{}>{

  constructor(props: NodeDetailsPanelProps) {
    super(props);
  }

  componentDidUpdate() {
    //console.error("Update details:", this.props.node);
  }

  render() {
    let header: JSX.Element = ( this.props.node ?
        (<span><b>Type:&nbsp;&nbsp;</b>{this.props.node.nodeTypeName()}</span>)
      : (<span>No node selected</span>)
    );

    return (
      <Panel header={header} >

      </Panel>
    );
  }

}
export default NodeDetailsPanel;


