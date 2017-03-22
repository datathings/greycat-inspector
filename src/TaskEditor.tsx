
import AceEditor from 'react-ace';
import * as React from 'react';
import 'brace/mode/java';
import 'brace/theme/tomorrow';
import AppState from './AppState';
import {observer} from 'mobx-react';

/* tslint:disable */
@observer
class TaskEditor extends React.Component<{appState: AppState}, {}> {

  shouldComponentUpdate(nextProps, nextState) {
    console.log("hello",nextProps, nextState)
    return true;
  }

  render() {
    console.log("render")
      return (
        <AceEditor
            mode="java"
            theme="tomorrow"
            onChange={(newVal)=> {this.props.appState.task = newVal;}}
            name="task_editor"
            value={this.props.appState.task}
        />
      );
  }
}

export default TaskEditor;
