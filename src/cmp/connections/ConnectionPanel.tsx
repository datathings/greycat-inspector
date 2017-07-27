
import * as React from 'react';
import {Component, SyntheticEvent} from 'react';
import Connection from "../../core/Connection";
import {Button, Col, Form, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row} from "react-bootstrap";
import CryptoJS = require("crypto-js");

export interface ConnectionPanelProps {
  connection?: Connection,
  onConnectionChanged?: (connection: Connection)=>any,
  onClose?: ()=>any
}

class ConnectionPanel extends Component<ConnectionPanelProps, {show:boolean}> {

  private _connection: Connection;

  constructor(props: ConnectionPanelProps) {
    super(props);
    this.state = {
      show: true
    };
    this._connection = this.props.connection || new Connection();
  }

  private savePassword() {
    if(this.password.value.trim() != "" && this.salt.value.trim() != "") {
      this._connection.password = CryptoJS.SHA256(this.password.value.trim() + this.salt.value.trim()).toString();
    }
  }
  private password:HTMLInputElement;
  private salt:HTMLInputElement;

  render() {
      return (
      <Modal key="modal" onHide={this.close.bind(this)} show={this.state.show}>
        <ModalHeader closeButton>
          <ModalTitle>Create new connection</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Form horizontal>
            <Row>
              <Col sm={3}><b>Name</b></Col>
              <Col sm={9}>
                <input type="text" onBlur={(e: SyntheticEvent<HTMLInputElement>)=>this._connection.name = e.currentTarget.value} defaultValue={this._connection.name}/>
              </Col>
            </Row>
            <Row>
              <Col sm={3}><b>Address</b></Col>
              <Col sm={9}>
                <input type="text" onBlur={(e: SyntheticEvent<HTMLInputElement>)=>this._connection.address = e.currentTarget.value} defaultValue={this._connection.address}/>
              </Col>
            </Row>
            <Row>
              <Col sm={3}><b>Use SSL</b></Col>
              <Col sm={3}>
                <input type="checkbox" onBlur={(e: SyntheticEvent<HTMLInputElement>)=>this._connection.isSSL = e.currentTarget.checked} defaultChecked={this._connection.isSSL}/>
              </Col>
              <Col sm={3}><b>Authenticate</b></Col>
              <Col sm={3}>
                <input type="checkbox" onBlur={(e: SyntheticEvent<HTMLInputElement>)=>this._connection.isAuthentication = e.currentTarget.checked} defaultChecked={this._connection.isAuthentication}/>
              </Col>
            </Row>
            <Row>
              <Col sm={3}><b>Login</b></Col>
              <Col sm={9}>
                <input type="text" onBlur={(e: SyntheticEvent<HTMLInputElement>)=>this._connection.login = e.currentTarget.value} defaultValue={this._connection.login}/>
              </Col>
            </Row>
            <Row>
              <Col sm={3}><b>Password</b></Col>
              <Col sm={4}>
                <input type="password" ref={(ref)=>this.password=ref} onBlur={this.savePassword.bind(this)} defaultValue={this._connection.password}/>
              </Col>
              <Col sm={4}>
                <input type="text" ref={(ref)=>this.salt=ref} onBlur={this.savePassword.bind(this)} />
              </Col>
            </Row>
            <Row>
              <Col sm={3}><b>Remember ?</b></Col>
              <Col sm={9}>
                <input type="checkbox" onBlur={(e: SyntheticEvent<HTMLInputElement>)=>this._connection.isToRemember = e.currentTarget.checked} defaultChecked={this._connection.isToRemember}/>
              </Col>
            </Row>
          </Form>
        </ModalBody>
        <ModalFooter><Button onClick={this.close.bind(this)}>Cancel</Button><Button onClick={this.save.bind(this)} bsStyle="success">{(this.props.connection?"Save":"Create")}</Button></ModalFooter>
      </Modal>
      );
  }

  private close() {
    this.setState({show: false});
    if(this.props.onClose) {
      this.props.onClose();
    }
  }

  private save() {
    this.close();
    if(this.props.onConnectionChanged) {
      this.props.onConnectionChanged(this._connection);
    }
  }

}

export default ConnectionPanel;
