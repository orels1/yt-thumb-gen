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
            'updateVignette',
            'updateTitleFontSize',
            'updateTitleText',
            'updateTitleAlignment',
            'updateTitleColor',
            'updateTitleShift',
            'updateSubTitleFontSize',
            'updateSubTitleText',
            'updateSubTitleAlignment',
            'updateSubTitleColor',
            'updateSubTitleShift'
        );
    }

    test() {

    }
}

export default alt.createActions(DrawingActions);
