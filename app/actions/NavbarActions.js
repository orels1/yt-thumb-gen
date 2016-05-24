/**
 * Created by orel- on 06/Dec/15.
 */
import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
    constructor() {
        this.generateActions(
            'updateSearchQuery',
            'updateAjaxAnimation',
            'findSuccess',
            'findFail'
        );
    }

    // Search method. Should be pretty straightforward
    find(payload) {
        $.ajax({
            'type': 'GET',
            'url': '/api/search',
            'data': { 'name': payload.searchQuery },
        })
            .done((data) => {
                // To pass down history inside the payload, as well as ref - we use assign
                assign(payload, data);
                this.actions.findSuccess(payload);
            })
            .fail(() => {
                this.actions.findFail(payload);
            });
    }
}

export default alt.createActions(NavbarActions);
