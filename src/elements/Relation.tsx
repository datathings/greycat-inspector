import * as React from 'react';
import {Component} from 'react';

import {Node as GCNode, Tasks, Task, TaskContext, TaskResult} from 'greycat';

import * as SplitPane from 'react-split-pane';

import 'bootstrap/dist/css/bootstrap.css';
import AppState from "../AppState";
import Node from "./Node";
import SyntheticEvent = React.SyntheticEvent;

export interface RelationProps {
  parent: GCNode,
  relName: string
  displayName ?: string
}

export interface RelationState {
  content: GCNode[]
  right: any
}

class Relation extends Component<RelationProps, RelationState> {

  constructor(props: RelationProps) {
    super(props);
    this.state = {
      content: [],
      right: null
    }
  }

  private static traverseMe : Task = Tasks.newTask()
    .travelInTime("{{time}}")
    .traverse("{{myName}}");

  componentDidMount() {
    AppState.graph((graph => {
      let taskContext : TaskContext = Relation.traverseMe.prepare(graph, this.props.parent, ((result:TaskResult<Node>)=>{
        this.setState({content  : result.asArray()});
      }).bind(this));
      taskContext.setTime((new Date()).getTime());
      taskContext.setVariable("myName", this.props.relName);
      Relation.traverseMe.executeUsing(taskContext);
    }).bind(this));
  }

  expandNode(e:SyntheticEvent<any>) {
    let node : GCNode = this.state.content[(e.target as HTMLElement).dataset['node']];
    this.setState({right:null}, ()=>{
      this.setState({right:(<Node me={node}/>)});
    });

  }

  render() {

    let children: any = "";
    if (this.state.content.length > 0) {

      let childElements = this.state.content.map((childNode: GCNode, idx: number) => {
        return (<li key={idx} className="list-group-item" style={{overflow:"hidden"}} onClick={this.expandNode.bind(this)} data-node={idx}>{childNode.get('name')}</li>);
      });
      children = (
        <ul className="list-group list-group-flush">
          {childElements}
        </ul>);
    }


    return (
    <SplitPane split="vertical" defaultSize={150} className="primary">
      <div>
        <div className="card">
          <div className="card-header">
            {(this.props.displayName?this.props.displayName:this.props.relName)}
          </div>
          {children}
        </div>
      </div>
      <div>
        {this.state.right}
      </div>
    </SplitPane>
      );
  }
}

export default Relation;
