import { observable } from 'mobx';

/* tslint:disable */
class AppState {
    @observable task = "travelInTime(0)";

/*
    constructor() {
            setInterval(() => {
                this.task += '#';
            }, 3000);
        }*/


}
export default AppState;
