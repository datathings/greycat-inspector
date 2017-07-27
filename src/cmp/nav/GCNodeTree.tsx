import * as React from 'react';
import {Component} from 'react';

import './tree.css';
import NavigationContext from './NavigationContext';
import TreeItemIndex from './TreeItemIndex';


export interface GCNodeTreeState {
  globalIndexes: string[]
}

class GCNodeTree extends Component<NavigationContext, GCNodeTreeState> {

  constructor(props: NavigationContext) {
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

  render() {
    let content: any = null;
    if (this.state.globalIndexes.length === 0) {
      content = <span>No index found</span>;
    } else {
      content = this.state.globalIndexes.map((idxName: string, idx: number) => {
        return <TreeItemIndex key={idxName} name={idxName} global={true} {...this.props}/>;
      });
    }
    return <ul className="tree-container">{content}</ul>;
  }
}

export default GCNodeTree;
