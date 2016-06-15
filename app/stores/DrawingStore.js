import alt from '../alt';
import DrawingActions from '../actions/DrawingActions';

class DrawingStore {
    constructor() {
        this.bindActions(DrawingActions);
        this.editor = '';
        this.ctx = '';
        this.img = null;
        this.frameColor = 'rgba(255,255,255,1)';
        this.padding = 0;
        this.border = 0;
        this.opacity = 0;
        this.titleFontSize = 30;
        this.titleText = '';
        this.titleAlignment = {
            'horizontal': 'center',
            'vertical': 'middle',
        };
        this.subTitleFontSize = 30;
        this.subTitleText = '';
        this.subTitleAlignment = {
            'horizontal': 'center',
            'vertical': 'middle',
        };
    }

    onUpdateBorder(value) {
        this.border = value;
    }

    onUpdatePadding(value) {
        this.padding = value;
    }

    onUpdateImage(value) {
        this.img = value;
    }

    onUpdateContext(value) {
        this.ctx = value;
    }

    onUpdateEditor(value) {
        this.editor = value;
    }

    onUpdateOpacity(value) {
        this.opacity = value;
    }

    onUpdateTitleFontSize(value) {
        this.titleFontSize = value;
    }

    onUpdateTitleText(value) {
        this.titleText = value;
    }

    onUpdateTitleAlignment(value) {
        this.titleAlignment = value;
    }

    onUpdateSubTitleFontSize(value) {
        this.subTitleFontSize = value;
    }

    onUpdateSubTitleText(value) {
        this.subTitleText = value;
    }

    onUpdateSubTitleAlignment(value) {
        this.subTitleAlignment = value;
    }

}

export default alt.createStore(DrawingStore);
