import ConnectionDetails from './ConnectionDetails';
import * as CryptoJS from "crypto-js";

class InspectorState {

  private _connections: ConnectionDetails[] = [];

  get connections() {
    return this._connections;
  }

  public addGraphPanel(newConnection: ConnectionDetails) {
    this._connections.push(newConnection);
    this._panelsListeners.forEach((lst: () => any) => {
      if (lst) {
        lst();
      }
    });
  }

  private _panelsListeners: (() => any)[] = [];

  public listenPanelAdded(cb: () => any): number {
    return this._panelsListeners.push(cb);
  }

  public removePanelListener(ref: number) {
    delete this._panelsListeners[ref];
  }

  private _storedConnections: Map<String, ConnectionDetails>;

  get storedConnections() {
    if (!this._storedConnections) {
      this._storedConnections = this.load();
    }
    return this._storedConnections;
  }

  public updateConnection(connection: ConnectionDetails) {
    this._storedConnections.set(connection.name, connection);
    this.save();
  }


  private static STORAGE_KEY: string = "com.datathings.inspector.state";
  private static STORAGE_SECRET: string = "7e7877363c276e28252f615f2878675d555b215a524a6b677b36554068";

  private save() {

    let connections = [];
    this._storedConnections.forEach((value: ConnectionDetails) => {
      connections.push(value);
    });
    let encripted: any = CryptoJS.AES.encrypt(JSON.stringify(connections), InspectorState.STORAGE_SECRET);
    window.localStorage.setItem(InspectorState.STORAGE_KEY, encripted.toString());
  }

  private load() {
    let map = new Map<String, ConnectionDetails>();
    let storedString = window.localStorage.getItem(InspectorState.STORAGE_KEY);
    if (storedString) {
      let decrypted: any = CryptoJS.AES.decrypt(storedString, InspectorState.STORAGE_SECRET);
      let content: any[] = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
      content.forEach((value: any) => {
        let connection = new ConnectionDetails();
        for(let attribute in value) {
          connection[attribute] = value[attribute];
        }
        map.set(value.name, connection);
      });
    }
    return map;
  }

}
export default InspectorState;
