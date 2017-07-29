import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode, plugin, Type } from '@greycat/greycat';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import TreeItemRelation from './TreeItemRelation';
import TreeItemIndex from './TreeItemIndex';

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
      let rels: ElementFromRelation[] = [];

      nState.each((attributeKey: number, elemType: number, elem: any) => {
        let retrieved: string = this.props.graph.resolver().hashToString(attributeKey);
        if (!retrieved) {
          retrieved = "" + attributeKey;
        }

        if (elemType === Type.RELATION || elemType === Type.INDEX  || elemType === Type.ERELATION) {
          console.log("Index", retrieved, "LocalIndex", elem);
          rels.push({node: this.props.node, relationName: retrieved, childType: elemType});
        } else if( elemType === Type.NDTREE || elemType === Type.KDTREE) {
          console.log("N/K-DTREE", retrieved, "N/K-DTREE", elem);
        } else if(Type.isCustom(elemType)) {
          rels.push({node: elem, childType: elemType});
        } else {
          console.error("Type Ignored");
        }

      });
      this.setState({children: rels, expanded: true});
    }
  }

  render() {
    const {node, ...otherProps} = this.props;
    let content: JSX.Element[] = [];
    if (this.state.expanded) {
      if(!this.state.expandFully) {
        for(let i = 0; i < this.props.visibilityLimit && i < this.state.children.length; i++) {
          let child = this.state.children[i];
          content.push(this.getRenderer(child, otherProps));
        }
        if(this.state.children.length > this.props.visibilityLimit) {
          content.push(
            <li className="tree-item" onClick={(e)=>{this.setState({expandFully:true});e.stopPropagation()}}>
              <span>...more({this.state.children.length-this.props.visibilityLimit})</span>
            </li>);
        }
      } else {
        this.state.children.forEach((child)=>{
          content.push(this.getRenderer(child, otherProps));
        });
      }
    }

    return (
      <li className="tree-item" onClick={this.expand.bind(this)}>
        <span><i className="fa fa-cube"/>&nbsp;{this.props.node.getWithDefault("name", this.props.node.id)}</span>
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }

  private getRenderer(e: ElementFromRelation, props: any): JSX.Element {
    if (e.childType === Type.RELATION || e.childType === Type.ERELATION) {
      return <TreeItemRelation key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} node={e.node} name={e.relationName} {...props}/>;
    } else if(e.childType === Type.INDEX) {
      return <TreeItemIndex key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} parent={e.node} name={e.relationName} {...props}/>;
    } else if(Type.isCustom(e.childType)) {
      //content.push(<TreeItemCustomNode key={e.node.id()+'_'+e.node.time()+'_'+e.relationName} node={e.node} {...this.props}/>);
    } else {
      console.error("Unknown children type:" + e.childType, e);
    }
    return null;
  }

}

export default TreeItemCustomNode;
