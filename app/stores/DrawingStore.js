import alt from '../alt';
import DrawingActions from '../actions/DrawingActions';

class DrawingStore {
    constructor() {
        this.bindActions(DrawingActions);
        this.editor = '';
        this.ctx = '';
        this.img = null;
        this.frameColor = {
            'r': 255,
            'g': 255,
            'b': 255,
            'a': 1,
        };
        this.padding = 0;
        this.border = 0;
        this.opacity = 0;
        this.titleFontSize = 30;
        this.titleText = '';
        this.titleAlignment = {
            'horizontal': 'center',
            'vertical': 'middle',
        };
        this.titleColor = {
            'r': 255,
            'g': 255,
            'b': 255,
            'a': 1,
        };
        this.subTitleFontSize = 30;
        this.subTitleText = '';
        this.subTitleAlignment = {
            'horizontal': 'center',
            'vertical': 'middle',
        };
        this.subTitleColor = {
            'r': 255,
            'g': 255,
            'b': 255,
            'a': 1,
        };
    }

    onUpdateBorder(value) {
        this.border = value;
    }

    onUpdatePadding(value) {
        this.padding = value;
    }

    onUpdateFrameColor(value) {
        this.frameColor = value;
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

    onUpdateTitleColor(value) {
        this.titleColor = value;
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

    onUpdateSubTitleColor(value) {
        this.subTitleColor = value;
    }

}

export default alt.createStore(DrawingStore);
