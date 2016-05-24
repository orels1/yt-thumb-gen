/**
 * Created by orel- on 06/Dec/15.
 */
import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
    constructor() {
        this.bindActions(NavbarActions);
        this.searchQuery = '';
        this.ajaxAnimationClass = '';
    }


    // What's left from search. Left here just for sake of keeping a useful code
    // onFindSuccess(payload) {
    //    // Change the url to something proper
    //    payload.history.pushState(null, '/news/' + payload.type + '/' + payload.newsId);
    // }
    //
    // onFindFail(payload) {
    //    payload.searchForm.classList.add('shake');
    //    setTimeout(() => {
    //        payload.searchForm.classList.remove('shake');
    //    }, 1000);
    // }

    onUpdateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    // This one takes care of that nice loading animation on ajax request
    onUpdateAjaxAnimation(className) {
        this.ajaxAnimationClass = className; // fadein or fadeout
    }
}

export default alt.createStore(NavbarStore);
