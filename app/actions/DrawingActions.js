/**
 * Created by orel- on 08/Dec/15.
 */
import alt from '../alt';

class DrawingActions {
    constructor() {
        this.generateActions(
        	'updatePadding',
            'updateBorder',
            'updateImage',
            'updateContext',
            'updateEditor',
            'updateOpacity',
            'updateTitleFontSize',
            'updateTitleText',
            'updateTitleAlignment',
            'updateSubTitleFontSize',
            'updateSubTitleText',
            'updateSubTitleAlignment'
        );
    }

    test() {

    }
}

export default alt.createActions(DrawingActions);
