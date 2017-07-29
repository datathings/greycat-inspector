import * as React from 'react';
import { Component } from 'react';
import { Node as GCNode, plugin, Type } from '@greycat/greycat';
import { Col, Panel, Row } from 'react-bootstrap';

interface NodeDetailsPanelProps {
  node: GCNode;
}

class NodeDetailsPanel extends Component<NodeDetailsPanelProps, {}> {

  constructor(props: NodeDetailsPanelProps) {
    super(props);
  }

  componentDidUpdate() {
    //console.error("Update details:", this.props.node);
  }

  render() {
    let attributeControls: JSX.Element[] = [];
    let header: JSX.Element = null;
    if (!this.props.node) {
      header = <span>No node selected</span>;
    } else {

      let resolver = this.props.node.graph().resolver();
      let typeName: string = this.props.node.nodeTypeName() || 'UNKNOWN(' + resolver.typeCode(this.props.node) + ')';

      header = <span><b>Type:&nbsp;&nbsp;</b>{typeName}</span>

      let nState: plugin.NodeState = this.props.node.graph().resolver().resolveState(this.props.node);
      nState.each((attributeKey: number, elemType: number, elem: any) => {
        if (!Type.isCustom(elemType)) {
          if (!(elemType === Type.RELATION || elemType === Type.INDEX)) {
            attributeControls.push(<Row key={attributeKey}>
              <Col sm={4}><b>{resolver.hashToString(attributeKey)}</b></Col>
              <Col sm={4}><b>{Type.typeName(elemType)}</b></Col>
              <Col sm={4}><b>{'' + elem}</b></Col>
            </Row>)
          }
        }
      });
    }


    return (
      <Panel header={header}>
        {attributeControls}
      </Panel>
    );
  }

}

export default NodeDetailsPanel;


