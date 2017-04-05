import * as React from 'react';
import {Component} from 'react';

import {Node as GCNode} from 'greycat';
import {plugin, Type} from 'greycat';

import * as SplitPane from 'react-split-pane';

import 'bootstrap/dist/css/bootstrap.css';
import AppState from "../AppState";
import Relation from "./Relation";
import SyntheticEvent = React.SyntheticEvent;

export interface NodeProps {
  me: GCNode
}

export interface NodeState {
  attributes: any[],
  relations: any[],
  right: any
}

export class Node extends Component<NodeProps, NodeState> {

  constructor(props: NodeProps) {
    super(props);
    this.state = {
      attributes: [],
      relations: [],
      right: null
    }
  }

  get name() {
    return this.props.me.get('name');
  }


  componentDidMount() {
    console.log("expand");
    AppState.graph(graph => {
      let nState: plugin.NodeState = graph.resolver().resolveState(this.props.me);

      let rels: any[] = [];
      let atts: any[] = [];

      nState.each((attributeKey: number, elemType: number, elem: any) => {
        let retrieved: string = graph.resolver().hashToString(attributeKey);
        if (!retrieved) {
          retrieved = ""+attributeKey;
        }
        if (elemType === Type.RELATION || elemType === Type.RELATION_INDEXED) {
          rels.push({key: retrieved, value: elem});
        } else {
          atts.push({key: retrieved, value: elem});
        }
      });

      this.setState({
        attributes: atts,
        relations: rels
      })
    });
  }

  expandRelation(e:SyntheticEvent<any>) {
    let relName : string = (e.target as HTMLElement).textContent;
    this.setState({right:null}, ()=>{
      this.setState({right:(<Relation parent={this.props.me} relName={relName}/>)});
    });

  }

  render() {

    let attributes: any = null;
    let relations: any = null;

    if(this.state.attributes.length > 0){

      let attributeList = this.state.attributes.map((att, idx:number)=>{
        return <tr key={idx}><td>{att.key}</td><td>{att.value}</td></tr>
      });

      attributes = (<div className="card-text">
        <table><tr><th>Attribute</th><th>Value</th></tr>
        <tbody>
        {attributeList}
        </tbody>
        </table>
      </div>);
    }

    if(this.state.relations.length > 0){

      let relationsList = this.state.relations.map(((rel, idx: number) => {
        return (<li key={idx} className="list-group-item" onClick={this.expandRelation.bind(this)} >{rel.key}</li>);
      }).bind(this));
      relations = (
        <ul className="list-group list-group-flush">
          {relationsList}
        </ul>);
    }

    return (
    <SplitPane split="vertical" defaultSize={150} className="primary">
      <div>
        <div className="card">
          <div className="card-header">
            {this.name}
          </div>
          {attributes}
          {relations}
        </div>
      </div>
      <div>
        {this.state.right}
      </div>
    </SplitPane>);
  }
}

export default Node;
