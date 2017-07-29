import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode, NodeIndex } from '@greycat/greycat';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import TreeItemNode from './TreeItemNode';

export interface TreeItemIndexProps extends NavigationContext {
  name: string;
  parent?: GCNode
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
      if(!this.props.parent) {
        this.props.graph.index(this.props.world, this.props.time, this.props.name, (index: NodeIndex) => {
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
        let index = this.props.parent.getIndex(this.props.name);
        index.find((nodes: GCNode[]) => {
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
          }, this.props.world, this.props.time);
      }
    }
  }

  render() {
    const {name, parent, ...otherProps} = this.props;
    let content: JSX.Element[] = [];

    if (this.state.expanded) {
      if(!this.state.expandFully) {
        for(let i = 0; i < this.props.visibilityLimit && i < this.state.children.length; i++) {
          let e = this.state.children[i];
          content.push(<TreeItemNode key={e.node.id()+'_'+e.node.time()} node={e.node} {...otherProps}/>);
        }
        if(this.state.children.length > this.props.visibilityLimit) {
          content.push(
            <li className="tree-item" onClick={(e)=>{this.setState({expandFully:true});e.stopPropagation()}}>
              <span>...more({this.state.children.length-this.props.visibilityLimit})</span>
            </li>);
        }
      } else {
        this.state.children.forEach((e)=>{
          content.push(<TreeItemNode key={e.node.id()+'_'+e.node.time()} node={e.node} {...otherProps}/>);
        });
      }
    }

    return (
      <li className="tree-item" onClick={(e) => this.expand(e)}>
        <span><i className="fa fa-hashtag"/>&nbsp;{this.props.name}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }

}

export default TreeItemIndex;
