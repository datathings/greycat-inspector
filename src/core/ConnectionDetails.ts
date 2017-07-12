

import {Graph, GraphBuilder} from "greycat";
import {WSClient} from "greycat-websocket";
class ConnectionDetails {

  public name : string;

  public address : string;

  public isSSL : boolean = false;

  public isAuthentication : boolean = false;

  public isToRemember : boolean = false;

  public login : string;

  public password : string;

  private graph : Graph;

  public connect(cb:(graph:Graph)=>any) {
      if(this.graph) {
        cb(this.graph);
      } else {
        let connectionLink = this.address;
        if(this.isAuthentication) {
          ConnectionDetails.authenticate((this.isSSL?"https://":"http://")+connectionLink , this.login, this.password, (success: boolean, key: string)=>{
            this.connectGraph((this.isSSL?"wss://":"ws://") + connectionLink + "/ws?gc-auth-key=" + key.split("#")[0], cb);
          });
        } else {
          this.connectGraph("ws" + connectionLink + "/ws", cb);
        }
      }
  }

  private connectGraph(url: string, cb:(graph: Graph)=>any) {
    let _graph: Graph = GraphBuilder.newBuilder().withStorage(new WSClient(url)).build();
    _graph.connect((result) => {
      if (result === true) {
        this.graph = _graph;
        cb(_graph);
      } else {
        console.error("Could not connect to " + url);
        cb(null);
      }
    });
  }

  private static authenticate(url: string, login: string, pass: string, cb: (authenticated: boolean, authenticationKey?: string) => any) {
    let fd = new FormData();
    fd.append("login", login);
    fd.append("pass", pass);

    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open('POST',  url + "/auth");
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.onerror = (event: ErrorEvent) => {
      console.error(event);
      if (cb) {
        cb(false, null);
      }
    };
    xhr.onreadystatechange = (event: ProgressEvent) => {
      let xhr = event.target as XMLHttpRequest;
      if (xhr.readyState === 4) {
        if (xhr.status == 200) {
          if (cb) {
            cb(true, xhr.responseText);
          }
        } else {
          if (cb) {
            cb(false, null);
          }
        }
      }
    };
    xhr.send(fd);
  }


  public

}
export default ConnectionDetails;
