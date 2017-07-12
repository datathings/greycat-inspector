import * as React from 'react';
import {Component} from 'react';

import {SyntheticEvent} from 'react';
import {Graph, Type} from "greycat";

import './tree.css';
import GCNodeTreeItem from "./GCNodeTreeItem";

export interface GCNodeTreeProps {
  graph: Graph,
  world: number,
  time: number
}

export interface GCNodeTreeState {
  globalIndexes: string[]
}

class GCNodeTree extends Component<GCNodeTreeProps, GCNodeTreeState> {

  constructor(props: GCNodeTreeProps) {
    super(props);
    this.state = {
      globalIndexes: []
    }
  }


  componentDidMount() {
    this.props.graph.indexNames(this.props.world, this.props.time, (globalIndexesNames: string[]) => {
      this.setState({globalIndexes: globalIndexesNames});
    });
  }

  expand(e: SyntheticEvent<any>) {
    let indexName: string = (e.target as HTMLElement).textContent;
    console.log(indexName, e);
  }

  render() {
    let content: any = null;
    if (this.state.globalIndexes.length === 0) {
      content = <span>No index found</span>;
    } else {
      content = this.state.globalIndexes.map((idxName: string, idx: number) => {
        return <GCNodeTreeItem key={idxName} type={Type.INDEX} graph={this.props.graph} relationName={idxName}/>;
      });
    }
    return <ul className="tree-container">{content}</ul>;
  }
}

export default GCNodeTree;
