import * as React from 'react';
import {Component} from 'react';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';
import InspectorState from '../../core/InspectorState';
import ConnectionDetails from '../../core/ConnectionDetails';
import ConnectionPanel from "./ConnectionPanel";

export interface ConnectionMenuProps {
  inspectorState: InspectorState;
}

class ConnectionMenu extends Component<ConnectionMenuProps, { showConnectionPanel: boolean, connectionSelected?: ConnectionDetails }> {

  constructor(props: ConnectionMenuProps) {
    super(props);
    this.state = {
      showConnectionPanel: false
    }
  }

  render() {

    let connectionSelector: JSX.Element[] = [];

    if (this.props.inspectorState.storedConnections.size === 0) {
      connectionSelector.push(<MenuItem key="none">No connection available.</MenuItem>);
    } else {
      this.props.inspectorState.storedConnections.forEach((conn: ConnectionDetails, key: string) => {
        connectionSelector.push(<MenuItem key={key} eventKey={"conn#" + key} value={key}>{key}</MenuItem>);
      });
    }

    let connectionControls: JSX.Element[] = [];
    if (this.state.connectionSelected) {
      connectionControls.push(<NavItem key="connect" eventKey="connect">Connect</NavItem>);
      connectionControls.push(<NavItem key="edit" eventKey="edit">Edit</NavItem>);
    }


    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href=""><img src="/greycat_logo.png" style={{height: "35px", marginTop: "-7px"}}/></a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav bsStyle="pills" onSelect={this.onMenuSelection.bind(this)}>
            <NavDropdown title={this.state.connectionSelected ? this.state.connectionSelected.name : "Connections"} id="connections-dropdown">{connectionSelector}</NavDropdown>
            {connectionControls}
            <NavItem eventKey="new">New</NavItem>
          </Nav>
        </Navbar>
        {(this.state.showConnectionPanel ?
          <ConnectionPanel connection={this.state.connectionSelected} onConnectionChanged={this.connectionEdited.bind(this)} onClose={() => this.setState({showConnectionPanel: false})}/> : null)}
      </div>
    );
  }

  private connectionEdited(connection: ConnectionDetails) {
    if (connection.isToRemember) {
      this.props.inspectorState.updateConnection(connection);
    }
    this.setState({connectionSelected: connection});
  }


  private onMenuSelection(eventKey: any) {
    if (eventKey) {
      console.log(eventKey);
      if (eventKey === "new") {
        this.setState({showConnectionPanel: true, connectionSelected: null});
      } else if (eventKey === "edit") {
        this.setState({showConnectionPanel: true});
      } else if (eventKey === "connect") {
        this.props.inspectorState.addGraphPanel(this.state.connectionSelected)
      } else if (eventKey.startsWith("conn")) {
        let connId = eventKey.split("#")[1];
        this.setState({connectionSelected: this.props.inspectorState.storedConnections.get(connId)});
      }
    }

  }
}
export default ConnectionMenu;


/*
 <Row>
 <Col sm={3}>
 <img src="/img/logo_bimy.png" style={{height:"50px", marginTop:"-10px"}}/>
 </Col>
 <Col sm={3}>

 </Col>
 <Col sm={1}>
 <Button>New</Button>
 </Col>
 <Col sm={1}>
 <Button>Edit</Button>
 </Col>
 <Col sm={1}>
 <Button>Connect</Button>
 </Col>
 </Row>
 */