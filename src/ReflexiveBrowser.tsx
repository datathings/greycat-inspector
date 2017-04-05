import * as React from 'react';
import {Component} from 'react';
import AppState from './AppState';

import * as SplitPane from 'react-split-pane';
import {SyntheticEvent} from 'react';
import {NodeIndex} from 'greycat';
import Relation from "./elements/Relation";


export interface ReflexiveBrowserProps {
  appState: AppState;
}

export interface ReflexiveBrowserState {
  indexes: string[],
  right: any
}

class ReflexiveBrowser extends Component<ReflexiveBrowserProps, ReflexiveBrowserState> {

  constructor(props: ReflexiveBrowserProps) {
    super(props);
    this.state = {
      indexes: [],
      right: null
    }
  }


  componentDidMount() {
    AppState.graph(graph => {
      graph.indexNames(0, (new Date()).getTime(), ((globalIndexesNames: string[]) => {
        this.setState({indexes: globalIndexesNames});
      }).bind(this));
    });

  }

  expand(e: SyntheticEvent<any>) {
    let indexName :string = (e.target as HTMLElement).textContent;
    console.log(indexName, e);

    AppState.graph(graph => {
      graph.index(0, (new Date()).getTime(), indexName, ((indexNode: NodeIndex) => {
        this.setState({right:null}, ()=>{
          this.setState({right:(<Relation parent={indexNode} relName="index" displayName={indexName} />)});
        });
      }).bind(this));
    });
  }

  render() {

    return (
      <SplitPane split="vertical" defaultSize={150} className="primary">
        <div>
          <ul className="list-group list-group-flush">
            {this.state.indexes.map((idxName: string, idx: number) => {
              return (<li key={idx} className="list-group-item" onClick={this.expand.bind(this)}>{idxName}</li>);
            })}
          </ul>
        </div>
        <div>
          {this.state.right}
        </div>
      </SplitPane>
    );
  }
}

export default ReflexiveBrowser;
