import * as React from 'react';
import {Component} from 'react';

import {Node as GCNode, internal} from 'greycat';
/*
import {plugin, Type} from 'greycat';
*/
import * as SplitPane from 'react-split-pane';

import 'bootstrap/dist/css/bootstrap.css';
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
    /*
    AppState.graph(graph => {
      let nState: plugin.NodeState = graph.resolver().resolveState(this.props.me);

      let rels: any[] = [];
      let atts: any[] = [];

      nState.each((attributeKey: number, elemType: number, elem: any) => {
        let retrieved: string = graph.resolver().hashToString(attributeKey);
        if (!retrieved) {
          retrieved = "" + attributeKey;
        }
        if (elemType === Type.RELATION) {
          rels.push({key: retrieved, value: elem});
        } else {
          switch (elemType) {
            case Type.BOOL:
              atts.push({key: retrieved, value: (elem?"true":"false")});
              break;
            case Type.STRING:
            case Type.LONG:
            case Type.INT:
            case Type.DOUBLE:
            case Type.STRING_ARRAY:
              atts.push({key: retrieved, value: elem});
              break;
            case Type.DOUBLE_ARRAY:
              atts.push({key: retrieved, value: "DoubleArray(" + (elem as any).size() + ")" });
              break;
            case Type.LONG_ARRAY:
              atts.push({key: retrieved, value: "LongArray(" + (elem as any).size() + ")" });
              break;
            case Type.INT_ARRAY:
              atts.push({key: retrieved, value: "IntArray(" + (elem as any).size() + ")" });
              break;
            case Type.DMATRIX:
              atts.push({key: retrieved, value: "DMATRIX(" + (elem as struct.DMatrix).data().length + ")" });
              break;
            case Type.LMATRIX:
              atts.push({key: retrieved, value: "LMATRIX(" + (elem as struct.LMatrix).data().length + ")" });
              break;
            case Type.ESTRUCT_ARRAY:
              atts.push({key: retrieved, value: "EGraph(" + (elem as struct.EStructArray).size()+ ")" });
              break;
            default: console.log(elemType,typeof elem);
          }

        }
      });

      this.setState({
        attributes: atts,
        relations: rels
      })
    });
    */
  }

  expandRelation(e: SyntheticEvent<any>) {
    let relName: string = (e.target as HTMLElement).textContent;
    this.setState({right: null}, () => {
      this.setState({right: (<Relation parent={this.props.me} relName={relName}/>)});
    });

  }

  render() {

    let attributes: any = null;
    let relations: any = null;

    if (this.state.attributes.length > 0) {

      let attributeList = this.state.attributes.map((att, idx: number) => {
        if (att.value instanceof internal.heap.HeapLongArray || att.value instanceof internal.heap.HeapDoubleArray || att.value instanceof internal.heap.HeapIntArray) {
          return <tr key={idx}>
            <td><b>{att.key}</b></td>
            <td>{att.value.extract().toString()}</td>
          </tr>
        } else {
          return <tr key={idx}>
            <td><b>{att.key}</b></td>
            <td>{att.value}</td>
          </tr>
        }
      });

      attributes = (<div className="card-text" style={{overflow:"hidden"}}>
        <table>
          <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
          {attributeList}
          </tbody>
        </table>
      </div>);
    }

    if (this.state.relations.length > 0) {

      let relationsList = this.state.relations.map(((rel, idx: number) => {
        return (
          <li key={idx} className="list-group-item" style={{overflow:"hidden"}} onClick={this.expandRelation.bind(this)}>{rel.key}</li>);
      }).bind(this));
      relations = (
        <ul className="list-group list-group-flush">
          {relationsList}
        </ul>);
    }

    return (
      <SplitPane split="vertical" defaultSize={150} className="primary force-position">
        <div>
          <div className="card">
            <div className="card-header">
              {(this.name ? this.name : 'No_Name')}
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
