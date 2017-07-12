/**
 * Created by gnain on 24/04/17.
 */


import * as React from "react";
import {Component, SyntheticEvent} from "react";
import {Constants, Graph, Node as GCNode, NodeIndex, Type, plugin, struct} from 'greycat';
import  EStructArray = struct.EStructArray;


class GCNodeTreeItem extends Component<{ graph: Graph, type: number, node?: GCNode, relationName?: string }, { children: {node?: GCNode, relationName?: string, childType:number}[], expanded: boolean, expandFully: boolean }> {

  constructor(props: any) {
    super(props);
    this.state = {
      children: [],
      expanded: false,
      expandFully: false
    }
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  private expand(event: SyntheticEvent<any>) {
    event.stopPropagation();
    if (this.state.expanded) {
      this.setState({expanded: false, expandFully: false});
    } else {
      if(this.props.type == Type.INDEX) {
        this.props.graph.index(0, Constants.BEGINNING_OF_TIME, this.props.relationName, (index: NodeIndex) => {
          index.findFrom((nodes: GCNode[]) => {
            this.setState({children: nodes.map((n)=>{return {node: n, relationName: null, childType: Type.NODE}}), expanded: true});
          })
        });
      } else if(this.props.type == Type.NODE) {
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
      } else if(this.props.type == Type.RELATION) {
        this.props.node.traverse(this.props.relationName, (content:GCNode[])=>{
          this.setState({children: content.map((n)=>{return {node: n, relationName: null, childType: Type.NODE}}), expanded: true});
        });
      }
    }
  }

  private static visibleLimit: number = 10;
  render() {

    let children = [];
    if (this.state.expanded) {
      if(!this.state.expandFully) {
        for(let i = 0; i < GCNodeTreeItem.visibleLimit && i < this.state.children.length; i++) {
          let child = this.state.children[i];
          children.push(<GCNodeTreeItem key={child.node.id()} type={child.childType} graph={this.props.graph} node={child.node} relationName={child.relationName}/>)
        }
        if(this.state.children.length > GCNodeTreeItem.visibleLimit) {
          children.push(
            <li className="tree-item" onClick={(e)=>{this.setState({expandFully:true});e.stopPropagation()}}>
              <span>...more({this.state.children.length-GCNodeTreeItem.visibleLimit})</span>
            </li>);
        }
      } else {
        this.state.children.forEach((child)=>{
          children.push(<GCNodeTreeItem key={child.node.id()} type={child.childType} graph={this.props.graph} node={child.node} relationName={child.relationName}/>)
        });
      }

    }


    let displayName: string = "";
    if (this.props.type == Type.RELATION || this.props.type == Type.INDEX ) {

      displayName = this.props.relationName;
      console.log(displayName);
    } else {
      let hasName = this.props.node.get("name");
      if (hasName) {
        displayName = hasName;
      } else {
        displayName = "" + this.props.node.id();
      }
    }

    let displayIcon: JSX.Element = null;
    switch (this.props.type) {
      case Type.INDEX:
        displayIcon = <i className="fa fa-hashtag"/>;
        break;
      case Type.NODE:
        displayIcon = <i className="fa fa-cube"/>;
        break;
      case Type.RELATION:
        displayIcon = <i className="fa fa-cubes"/>;
        break;
    }

    return (
      <li className="tree-item" onClick={this.expand.bind(this)}>
        <span>{displayIcon}&nbsp;{displayName}</span>
        {(children.length > 0?<ul className="tree-container">{children}</ul>:null)}
      </li>);
  }


}
export default GCNodeTreeItem;


