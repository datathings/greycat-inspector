import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode, plugin, struct, Type } from 'greycat';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import EStructArray = struct.EStructArray;

interface TreeItemCustomNodeProps extends NavigationContext {
  node: GCNode
}

class TreeItemCustomNode extends Component<TreeItemCustomNodeProps, TreeItemState> {

  constructor(props: TreeItemCustomNodeProps) {
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
      if(this.props.onNodeSelected) {
        this.props.onNodeSelected(this.props.node);
      }
      console.error("Expand CustomNode");
      let nState: plugin.NodeState = this.props.graph.resolver().resolveState(this.props.node);
      let rels: {node?: GCNode, relationName?: string, childType:number}[] = [];

      nState.each((attributeKey: number, elemType: number, elem: any) => {
        let retrieved: string = this.props.graph.resolver().hashToString(attributeKey);
        if (!retrieved) {
          retrieved = "" + attributeKey;
        }
        if(Type.isCustom(elemType)) {
          console.log("Custom", attributeKey, elemType, elem);
          for(let i = 0; i < (elem as EStructArray).size(); i++ ){
            //let eStructState: plugin.NodeState = this.props.graph.resolver().resolveState(.);
            (elem as EStructArray).estruct(i).each((attributeKey2, elemType2, elem2) => {
              console.log("Custom2", attributeKey2, elemType2, elem2);
            });
          }
        } else {
          if (elemType === Type.RELATION || elemType === Type.INDEX  || elemType === Type.ERELATION) {
            rels.push({node: this.props.node, relationName: retrieved, childType: elemType});
          }
        }
      });
      this.setState({children: rels, expanded: true});
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

export default TreeItemCustomNode;
