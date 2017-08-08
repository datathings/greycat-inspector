import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode } from '@greycat/greycat';
import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import TreeItemNode from './TreeItemNode';

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
      this.props.node.traverse(this.props.name, (content: GCNode[]) => {
        this.setState({
          children    : content.map((n) => {
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
      });
    }
  }

  render() {
    let content: JSX.Element[] = [];
    const {node, name, ...otherProps} = this.props;
    if (this.state.expanded) {
      if (!this.state.expandFully) {
        for (let i = 0; i < this.props.visibilityLimit && i < this.state.children.length; i++) {
          let e = this.state.children[i];
          content.push(<TreeItemNode key={e.node.id() + '_' + e.node.time()} node={e.node} {...otherProps}/>);
          //content.push(this.getRenderer(child, otherProps));
        }
        if (this.state.children.length > this.props.visibilityLimit) {
          content.push(
            <li key='more' className="tree-item" onClick={(e) => {
              this.setState({expandFully: true});
              e.stopPropagation()
            }}>
              <span>...more({this.state.children.length - this.props.visibilityLimit})</span>
            </li>);
        }
      } else {
        this.state.children.forEach((e) => {
          content.push(<TreeItemNode key={e.node.id() + '_' + e.node.time()} node={e.node} {...otherProps}/>);

          //content.push(this.getRenderer(child, otherProps));
        });
      }
    }

    return (
      <li className="tree-item" onClick={this.expand.bind(this)}>
        <span><i className="fa fa-cubes"/>&nbsp;{this.props.name}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }

  /*
  private getRenderer(e: ElementFromRelation, props: any): JSX.Element {
    let typeHash = e.node.graph().resolver().typeCode(e.node);
    if(Type.isCustom(typeHash)) {
      return <TreeItemCustomNode key={e.node.id()+'_'+e.node.time()} node={e.node} {...props}/>;
    } else {
      return <TreeItemBaseNode key={e.node.id()+'_'+e.node.time()} node={e.node} {...props}/>;
    }
  }
  */
}

export default TreeItemRelation;
