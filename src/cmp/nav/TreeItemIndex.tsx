import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode, NodeIndex, Type } from 'greycat';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import TreeItemBaseNode from './TreeItemBaseNode';
import TreeItemCustomNode from './TreeItemCustomNode';

export interface TreeItemIndexProps extends NavigationContext {
  name: string;
  global?: boolean
}

class TreeItemIndex extends Component<TreeItemIndexProps, TreeItemState> {

  constructor(props: TreeItemIndexProps) {
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
      } else {
        console.error("Local index not implemented");
      }
    }
  }

  render() {
    let content: JSX.Element[] = [];
    this.state.children.forEach((e:ElementFromRelation, idx:number)=>{
      let typeHash = e.node.graph().resolver().typeCode(e.node);
      if(Type.isCustom(typeHash)) {
        content.push(<TreeItemCustomNode key={e.node.id()+'_'+e.node.time()} node={e.node} {...this.props}/>);
      } else {
        content.push(<TreeItemBaseNode key={e.node.id()+'_'+e.node.time()} node={e.node} {...this.props}/>);
      }
    });

    return (
      <li className="tree-item" onClick={(e) => this.expand(e)}>
        <span><i className="fa fa-hashtag"/>&nbsp;{this.props.name}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }
}

export default TreeItemIndex;
