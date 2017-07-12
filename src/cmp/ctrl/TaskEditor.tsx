
//mport AceEditor from 'react-ace';
import * as React from 'react';
import 'brace/mode/java';
import 'brace/theme/tomorrow';
//import {observer} from 'mobx-react';
//import * as SplitPane from 'react-split-pane';

class TaskEditor extends React.Component<{}, {}> {

  render() {
      return (
        <div />
      );
  }
}

export default TaskEditor;



/*

 <SplitPane split="vertical" defaultSize={100} className="primary">
 <div>
 <AceEditor
 mode="java"
 theme="tomorrow"
 onChange={(newVal)=> {this.props.appState.task = newVal;}}
 name="task_editor"
 value={this.props.appState.task}
 />
 </div>
 <div>
 <h2>Hello</h2>
 </div>
 </SplitPane>

*/