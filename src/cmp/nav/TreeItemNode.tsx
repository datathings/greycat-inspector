import * as React from 'react';
import { Component, SyntheticEvent } from 'react';

import { Node as GCNode, plugin, Type } from '@greycat/greycat';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemState from './TreeItemState';
import ElementFromRelation from '../../core/ElementFromRelation';
import TreeItemRelation from './TreeItemRelation';
import TreeItemIndex from './TreeItemIndex';
import TreeItemEStruct from './TreeItemEStruct';

interface TreeItemNodeProps extends NavigationContext {
  node: GCNode;
  nameInParent?: string;
}

class TreeItemNode extends Component<TreeItemNodeProps, TreeItemState> {

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
      if(this.props.onNodeSelected) {
        this.props.onNodeSelected(this.props.node);
      }
      if(this.props.nameInParent){
        let typedAttribute = this.props.node.getEGraph(this.props.nameInParent);
        console.log("TypedAttribute", typedAttribute);
        let rels: ElementFromRelation[] = [];
        for(let i = 0; i < typedAttribute.size(); i++) {
          let containedNode = typedAttribute.estruct(i);
          rels.push({node: this.props.node, container: containedNode, relationName: '' + i, childType: Type.ESTRUCT});
        }
        this.setState({children: rels, expanded: true});
      } else {
        let nState: plugin.NodeState = this.props.graph.resolver().resolveState(this.props.node);
        let rels: ElementFromRelation[] = [];

        nState.each((attributeKey: number, elemType: number, elem: any) => {
          let retrieved: string = this.props.graph.resolver().hashToString(attributeKey);
          if (!retrieved) {
            retrieved = "" + attributeKey;
          }
          if (elemType === Type.RELATION || elemType === Type.INDEX  || elemType === Type.ERELATION) {
            rels.push({node: this.props.node, relationName: retrieved, childType: elemType});
          } else if(Type.isCustom(elemType)) {
            rels.push({node: elem, relationName: retrieved, childType: elemType});
          }

        });
        this.setState({children: rels, expanded: true});
      }
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
            <li key="more" className="tree-item" onClick={(e)=>{this.setState({expandFully:true});e.stopPropagation()}}>
              <span>...more({this.state.children.length-this.props.visibilityLimit})</span>
            </li>);
        }
      } else {
        this.state.children.forEach((child)=>{
          content.push(this.getRenderer(child, otherProps));
        });
      }
    }
    let render: JSX.Element;
    if(this.props.nameInParent) {
      render = <span><i className="fa fa-object-group"/>&nbsp;{this.props.nameInParent}</span>

    } else {      
      let itemName = this.props.node.getWithDefault("name", this.props.node.id());
      if(typeof itemName !== 'string' ) {
        itemName = this.props.node.id();
      } 
      render = <span><i className="fa fa-cube"/>&nbsp;{itemName}</span>
    }

    return (
      <li className="tree-item" onClick={this.expand.bind(this)}>
        {render}
        {(content.length > 0 ? <ul className="tree-container">{content}</ul> : null)}
      </li>);
  }

  private getRenderer(e: ElementFromRelation, props: any): JSX.Element {
    if (e.childType === Type.RELATION || e.childType === Type.ERELATION) {
      return <TreeItemRelation key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} node={e.node} name={e.relationName} {...props}/>;
    } else if(e.childType === Type.INDEX) {
      return <TreeItemIndex key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} parent={e.node} name={e.relationName} {...props}/>;
    } else if(e.childType === Type.ESTRUCT) {
      return <TreeItemEStruct key={e.node.id()+'_'+e.node.time() + '_' + e.relationName} node={e.container} indexInParent={e.relationName} {...props}/>;
    } else if(Type.isCustom(e.childType)) {
      return <TreeItemNode key={this.props.node.id()+'_'+this.props.node.time()+'_'+e.relationName} node={e.node} nameInParent={e.relationName} {...this.props}/>;
    } else {
      console.error("Unknown children type:" + e.childType, e);
    }
    return null;
  }

}

export default TreeItemNode;
