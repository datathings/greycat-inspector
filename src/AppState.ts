import { observable } from 'mobx';
import { Graph, GraphBuilder } from 'greycat';
import { WSClient } from 'greycat-websocket';

/* tslint:disable */
class AppState {
    url: string = "localhost:3000";
    graph : Graph;
    @observable task: string = "travelInTime(0)";

    static graph2:Graph = null;

    public static setConnectionLink(link:string) {
        window.sessionStorage.setItem("greycat:inspector:connection", link);
        AppState.graph2 = undefined;
    }

    public static graph(cb:(g:Graph)=>any) {
        if(AppState.graph2) {
            cb(AppState.graph2);
        } else {
            let connectionLink = window.sessionStorage.getItem("greycat:inspector:connection");
            if(connectionLink === undefined) {
               connectionLink = "localhost:3000";
            }
            let graph: Graph = GraphBuilder.newBuilder().withStorage(new WSClient('ws://' + connectionLink + '/ws')).build();
            graph.connect((result) => {
                if (result === true) {
                    AppState.graph2 = graph;
                    cb(graph);
                } else {
                    console.error("Could not connect to " + connectionLink);
                    cb(null);
                }
            });
        }
    }


}
export default AppState;
