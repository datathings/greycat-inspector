import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode, Type } from 'greycat';
import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import TreeItemCustomNode from './TreeItemCustomNode';
import TreeItemBaseNode from './TreeItemBaseNode';

interface TreeItemRelationProps extends NavigationContext {
  node: GCNode
  name: string
}

class TreeItemRelation extends Component<TreeItemRelationProps, TreeItemState> {

  constructor(props: TreeItemRelationProps) {
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
      console.error("Expand relation");
      this.props.node.traverse(this.props.name, (content:GCNode[])=>{
        this.setState({children: content.map((n)=>{
          if (n) {
            let elt = new ElementFromRelation();
            elt.node = n;
            elt.relationName = null;
            return elt;
          } else {
            return null;
          }
        }), expanded: true});
      });
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
      <li className="tree-item" onClick={this.expand.bind(this)}>
        <span><i className="fa fa-cube"/>&nbsp;{this.props.node.getWithDefault("name", this.props.node.id)}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }
}

export default TreeItemRelation;
