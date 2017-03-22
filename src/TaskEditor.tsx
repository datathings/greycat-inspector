
import AceEditor from 'react-ace';
import * as React from 'react';
import 'brace/mode/java';
import 'brace/theme/tomorrow';
import AppState from './AppState';
import {observer} from 'mobx-react';

/* tslint:disable */
@observer
class TaskEditor extends React.Component<{appState: AppState}, string> {

  render() {
    console.log("render",this.props, this.state)
      return (
        <AceEditor
            mode="java"
            theme="tomorrow"
            onChange={(newVal)=> {this.state= newVal;this.props.appState.task = newVal;}}
            name="task_editor"
            value={this.props.appState.task}
        />
      );
  }
}

export default TaskEditor;
