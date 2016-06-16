/**
 * Created by orel- on 08/Dec/15.
 */
import alt from '../alt';

class DrawingActions {
    constructor() {
        this.generateActions(
        	'updatePadding',
            'updateBorder',
            'updateFrameColor',
            'updateImage',
            'updateContext',
            'updateEditor',
            'updateOpacity',
            'updateTitleFontSize',
            'updateTitleText',
            'updateTitleAlignment',
            'updateTitleColor',
            'updateSubTitleFontSize',
            'updateSubTitleText',
            'updateSubTitleAlignment',
            'updateSubTitleColor'
        );
    }

    test() {

    }
}

export default alt.createActions(DrawingActions);
