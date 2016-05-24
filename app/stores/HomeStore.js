/**
 * Created by orel- on 08/Dec/15.
 */
import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
    constructor() {
        this.bindActions(HomeActions);
        /**
         * All your data for this component should be placed here.
         * Consider this as a properties of your component
         * You can set new ones like this:
         * this.whatever = 'whatever else';
         */
    }

    /**
    Here will be your listeners which were bound by `this.bindActions()`
    Example listener:

    onChangeWhatever(data) {
		this.whatever = data;
    }

    as you can see, it's just a setter
    */

}

export default alt.createStore(HomeStore);
