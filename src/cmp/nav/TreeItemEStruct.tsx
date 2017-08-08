import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import { struct } from '@greycat/greycat';
import EStruct = struct.EStruct;

interface TreeItemNodeProps extends NavigationContext {
  node: EStruct;
  indexInParent?: string;
}

class TreeItemEStruct extends Component<TreeItemNodeProps, TreeItemState> {

  constructor(props: TreeItemNodeProps) {
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
      if (this.props.onNodeSelected) {
        this.props.onNodeSelected(this.props.node);
      }

    }
  }

  render() {
    const {node, ...otherProps} = this.props;
    let content: JSX.Element[] = [];
    if (this.state.expanded) {
      if (!this.state.expandFully) {
        for (let i = 0; i < this.props.visibilityLimit && i < this.state.children.length; i++) {
          let child = this.state.children[i];
          content.push(this.getRenderer(child, otherProps));
        }
        if (this.state.children.length > this.props.visibilityLimit) {
          content.push(
            <li className="tree-item" onClick={(e) => {
              this.setState({expandFully: true});
              e.stopPropagation()
            }}>
              <span>...more({this.state.children.length - this.props.visibilityLimit})</span>
            </li>);
        }
      } else {
        this.state.children.forEach((child) => {
          content.push(this.getRenderer(child, otherProps));
        });
      }
    }

    return (
      <li className="tree-item" onClick={this.expand.bind(this)}>
        <span><i className="fa fa-object-group"/>&nbsp;{this.props.indexInParent}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }

  private getRenderer(e: ElementFromRelation, props: any): JSX.Element {
    /*
    if (e.childType === Type.RELATION || e.childType === Type.ERELATION) {
      return <TreeItemRelation key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} node={e.node} name={e.relationName} {...props}/>;
    } else if(e.childType === Type.INDEX) {
      return <TreeItemIndex key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} parent={e.node} name={e.relationName} {...props}/>;
    } else if(e.childType === Type.ESTRUCT) {
      return <TreeItemRelation key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} node={e.container} name={e.relationName} {...props}/>;
    } else if(Type.isCustom(e.childType)) {
      return <TreeItemEStruct key={this.props.node.id()+'_'+this.props.node.time()+'_'+e.relationName} node={e.node} nameInParent={e.relationName} {...this.props}/>;
    } else {
      console.error("Unknown children type:" + e.childType, e);
    }*/
    return null;
  }

}

export default TreeItemEStruct;
