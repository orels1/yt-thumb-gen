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
        this.overlay = {
            'opacity': 0,
            'color': {
                'r': 0,
                'g': 0,
                'b': 0,
                'a': 0,
            },
        };
        this.vignette = {
            'opacity': 0,
            'size': 0,
        };
        this.titleFontSize = 30;
        this.titleText = '';
        this.titleAlignment = {
            'horizontal': 'center',
            'vertical': 'bottom',
        };
        this.titleColor = {
            'r': 255,
            'g': 255,
            'b': 255,
            'a': 1,
        };
        this.titleShift = {
            'h': 0,
            'v': 0,
        };
        this.subTitleFontSize = 30;
        this.subTitleText = '';
        this.subTitleAlignment = {
            'horizontal': 'center',
            'vertical': 'top',
        };
        this.subTitleColor = {
            'r': 255,
            'g': 255,
            'b': 255,
            'a': 1,
        };
        this.subTitleShift = {
            'h': 0,
            'v': 0,
        };
        this.branding = {
            'img': null,
            'h': 0,
            'v': 0,
            'opacity': 1,
            'scale': 1,
            'align': 'left',
            'valign': 'top',
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

    onUpdateOverlay(value) {
        this.overlay = value;
    }

    onUpdateVignette(value) {
        this.vignette = value;
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

    onUpdateTitleShift(value) {
        this.titleShift = value;
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

    onUpdateSubTitleShift(value) {
        this.subTitleShift = value;
    }

    onUpdateBranding(value) {
        this.branding = value;
    }

}

export default alt.createStore(DrawingStore);
