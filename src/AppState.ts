import { observable } from 'mobx';
import { Graph } from 'greycat';

/* tslint:disable */
class AppState {
    url: string = "localhost:3000";
    graph : Graph;
    @observable task: string = "travelInTime(0)";
}
export default AppState;
