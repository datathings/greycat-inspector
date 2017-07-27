import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode} from 'greycat';
import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';

interface TreeItemBaseNodeProps extends NavigationContext {
  node: GCNode
}

class TreeItemBaseNode extends Component<TreeItemBaseNodeProps, TreeItemState> {

  constructor(props: TreeItemBaseNodeProps) {
    super(props);
    this.state = {
      children   : [],
      expanded   : false,
      expandFully: false
    }
  }

  private expand(event: SyntheticEvent<any>) {
    event.stopPropagation();
    if (this.state.expanded) {
      this.setState({expanded: false, expandFully: false});
    } else {
      console.error("Expand BaseNode");
      /*
      if(this.props.global) {
        this.props.graph.index(0, (new Date()).getTime(), this.props.name, (index: NodeIndex) => {
          index.findFrom((nodes: GCNode[]) => {
            this.setState({
              children : nodes.map((n) => {
                if (n) {
                  let elt = new ElementFromRelation();
                  elt.node = n;
                  elt.relationName = null;
                  return elt;
                } else {
                  return null;
                }
              }), expanded: true
            });
          })
        });
      }*/
    }
  }

  render() {
    let content: JSX.Element[] = [];

    return (
      <li className="tree-item" onClick={this.expand.bind(this)}>
        <span><i className="fa fa-cube"/>&nbsp;{this.props.node.getWithDefault("name", this.props.node.id)}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }
}

export default TreeItemBaseNode;
