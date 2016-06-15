import React from 'react';
import DrawingStore from '../stores/DrawingStore';
import DrawingActions from '../actions/DrawingActions';
import {Link} from 'react-router';

// Extra components
import Dropzone from 'react-dropzone';
import Slider from 'react-rangeslider';

// Your main class, as defined in routes.
// You can read more about component's lifecycle here
// https://facebook.github.io/react/docs/component-specs.html

class Drawing extends React.Component {
    constructor(props) {
        super(props);
        // We are getting state from our store
        this.state = DrawingStore.getState();
        // And listen to any changes to get the two-way binding
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // Will fire once, after markup has been injected
        DrawingStore.listen(this.onChange);
    }

    componentWillUnmount() {
        // Will fire once before markup has been removed
        DrawingStore.unlisten(this.onChange);
    }

    onChange(state) {
        // We are listening to the store here and apply changes to this.state accodingly
        this.setState(state);
    }

    // Handle dropzone event
    handleDrop(files) {
        console.log('Received files: ', files);
        files.forEach((file, index) => {
            console.log('Current preview', file.preview);

            // Convert to data url for further manipulations
            function convertFileToDataURLviaFileReader(url, callback){
                let xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = () => {
                    let reader  = new FileReader();
                    reader.onloadend = () => {
                        callback(reader.result);
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', url);
                xhr.send();
            }

            // Convert and add display
            convertFileToDataURLviaFileReader(file.preview, (base64img) => {
                this.loadImageToCanvas(base64img);
                $('#dropzone').addClass('complete');
            });
        });
    }

    loadImageToCanvas(base64img) {
        // Get holder
        DrawingActions.updateEditor($('#editor')[0]);
        DrawingActions.updateContext(editor.getContext('2d'));
        DrawingActions.updateImage(new Image());

        // Set editor dimensions
        this.state.editor.height = 624;
        this.state.editor.width = 1110;

        // load image
        this.state.img.src = base64img;

        // paste image to canvas
        this.state.img.onload = () => {
            this.state.ctx.drawImage(this.state.img, 0, 0, 1110, 624);
        };
    }

    reloadCanvas() {
        this.state.ctx.drawImage(this.state.img, 0, 0, 1110, 624);
    }

    redrawCanvas() {
        // wait a bit for complex values
        setTimeout(() => {
            // clear canvas first
            this.reloadCanvas();

            // perform checks and draw stuff
            if (this.state.opacity !== 0) {
                this.drawOverlay(this.state.opacity);
            }
            if (this.state.border !== 0) {
                this.drawFrame(this.state.border, this.state.padding, this.state.frameColor);
            }
            if (this.state.titleText.length !== 0) {
                this.drawText(this.state.titleText,
                              this.state.titleFontSize,
                              this.state.titleAlignment,
                              1);
            }
            if (this.state.subTitleText.length !== 0) {
                this.drawText(this.state.subTitleText,
                              this.state.subTitleFontSize,
                              this.state.subTitleAlignment,
                              2);
            }
        }, 50);
    }

    drawFrame(border, padding, color) {
        // set stroke color
        this.state.ctx.strokeStyle = color;

        for (let i = border; i > 0; i--) {
            this.state.ctx.strokeRect(padding + i, padding + i, 1110 - padding * 2 - i * 2, 624 - padding * 2 - i * 2);
        }
    }

    drawOverlay(opacity) {
        // set fill color
        this.state.ctx.fillStyle = 'rgba(0,0,0,' + opacity + ')';

        this.state.ctx.fillRect(0, 0, 1110, 624);
    }

    drawText(text, font, alignment, position) {
        // set font
        this.state.ctx.font = font + 'px Bebas Neue Bold';

        // set fill color
        this.state.ctx.fillStyle = 'rgba(255,255,255,1)';

        // set text align
        this.state.ctx.textAlign = alignment.horizontal;

        // set text baseling
        this.state.ctx.textBaseline = alignment.vertical;

        if (position === 1) {
            this.state.ctx.fillText(text, 555, 312);
        } else {
            this.state.ctx.fillText(text, 555, 312);
        }
    }

    downloadURI(uri, name) {
        let link = document.createElement('a');
        link.download = name;
        link.href = uri;
        link.click();
        document.body.appendChild(link);
        // after creating link you should delete dynamic link
        // clearDynamicLink(link);
    }

    handlePaddingChange(value) {
        DrawingActions.updatePadding(value);
        this.redrawCanvas();
    }

    handleBorderChange(value) {
        DrawingActions.updateBorder(value);
        this.redrawCanvas();
    }

    handleOverlayChange(value) {
        DrawingActions.updateOpacity(value);
        this.redrawCanvas();
    }

    handleTitleFontChange(value) {
        DrawingActions.updateTitleFontSize(value);
        this.redrawCanvas();
    }

    handleTitleTextChange(event) {
        DrawingActions.updateTitleText(event.target.value);
        this.redrawCanvas();
    }

    handleTitleAlignmentChange(type, alignment) {
        if (type === 1) {
            DrawingActions.updateTitleAlignment({
                'horizontal': alignment,
                'vertical': this.state.titleAlignment.vertical,
            });
        } else {
            DrawingActions.updateTitleAlignment({
                'horizontal': this.state.titleAlignment.horizontal,
                'vertical': alignment,
            });
        }
        this.redrawCanvas();
    }

    handleSubTitleFontChange(value) {
        DrawingActions.updateSubTitleFontSize(value);
        this.redrawCanvas();
    }

    handleSubTitleTextChange(event) {
        DrawingActions.updateSubTitleText(event.target.value);
        this.redrawCanvas();
    }

    handleSubTitleAlignmentChange(type, alignment) {
        if (type === 1) {
            DrawingActions.updateSubTitleAlignment({
                'horizontal': alignment,
                'vertical': this.state.subTitleAlignment.vertical,
            });
        } else {
            DrawingActions.updateSubTitleAlignment({
                'horizontal': this.state.subTitleAlignment.horizontal,
                'vertical': alignment,
            });
        }
        this.redrawCanvas();
    }

    handleSaveResult() {
        this.downloadURI(this.state.editor.toDataURL('image/png'), 'thumbnail.png');
    }

    render() {
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div className="panel-title">
                            Image generation
                        </div>
                    </div>
                    <div className="panel-body">
                        <p>
                            To start working on an image - drag and drop it on the box below
                        </p>
                        <Dropzone
                        id={'dropzone'}
                        className="dropzone"
                        onDrop={this.handleDrop.bind(this)}
                        accept="image/*"
                        >
                            <div>Drop an image</div>
                        </Dropzone>
                        {this.state.img &&
                            <div>
                                <p>
                                    Frame padding (distance from edges)
                                </p>
                                <Slider
                                value={this.state.padding}
                                min={0}
                                max={50}
                                step={1}
                                orientation="horizontal"
                                onChange={this.handlePaddingChange.bind(this)}
                                />

                                <p>
                                    Frame size
                                </p>

                                <Slider
                                value={this.state.border}
                                min={0}
                                max={50}
                                step={1}
                                orientation="horizontal"
                                onChange={this.handleBorderChange.bind(this)}
                                />

                                <p>
                                    Black overlay opacity
                                </p>

                                <Slider
                                value={this.state.opacity}
                                min={0}
                                max={1}
                                step={0.05}
                                orientation="horizontal"
                                onChange={this.handleOverlayChange.bind(this)}
                                />

                                <p>
                                    Title Text
                                </p>

                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-btn">
                                            <button className="btn btn-default"
                                            onClick={this.handleTitleAlignmentChange.bind(this, 1, 'right')}
                                            >
                                                <span className="glyphicon glyphicon-align-left"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleTitleAlignmentChange.bind(this, 1, 'center')}
                                            >
                                                <span className="glyphicon glyphicon-align-center"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleTitleAlignmentChange.bind(this, 1, 'left')}
                                            >
                                                <span className="glyphicon glyphicon-align-right"></span>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.titleText}
                                            placeholder="First line of text e.g. your name"
                                            onChange={this.handleTitleTextChange.bind(this)}
                                        />
                                        <div className="input-group-btn">
                                            <button className="btn btn-default"
                                            onClick={this.handleTitleAlignmentChange.bind(this, 2, 'bottom')}
                                            >
                                                <span className="glyphicon glyphicon-collapse-up"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleTitleAlignmentChange.bind(this, 2, 'middle')}
                                            >
                                                <span className="glyphicon glyphicon-expand"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleTitleAlignmentChange.bind(this, 2, 'top')}
                                            >
                                                <span className="glyphicon glyphicon-collapse-down"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    Title font size
                                </p>

                                <Slider
                                value={this.state.titleFontSize}
                                min={10}
                                max={200}
                                step={2}
                                orientation="horizontal"
                                onChange={this.handleTitleFontChange.bind(this)}
                                />

                                <p>
                                    Subtitle Text
                                </p>

                                <div className="form-group">
                                    <div className="input-group">
                                        <div className="input-group-btn">
                                            <button className="btn btn-default"
                                            onClick={this.handleSubTitleAlignmentChange.bind(this, 1, 'right')}
                                            >
                                                <span className="glyphicon glyphicon-align-left"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleSubTitleAlignmentChange.bind(this, 1, 'center')}
                                            >
                                                <span className="glyphicon glyphicon-align-center"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleSubTitleAlignmentChange.bind(this, 1, 'left')}
                                            >
                                                <span className="glyphicon glyphicon-align-right"></span>
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={this.state.subTitleText}
                                            placeholder="First line of text e.g. your name"
                                            onChange={this.handleSubTitleTextChange.bind(this)}
                                        />
                                        <div className="input-group-btn">
                                            <button className="btn btn-default"
                                            onClick={this.handleSubTitleAlignmentChange.bind(this, 2, 'bottom')}
                                            >
                                                <span className="glyphicon glyphicon-collapse-up"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleSubTitleAlignmentChange.bind(this, 2, 'middle')}
                                            >
                                                <span className="glyphicon glyphicon-expand"></span>
                                            </button>
                                            <button className="btn btn-default"
                                            onClick={this.handleSubTitleAlignmentChange.bind(this, 2, 'top')}
                                            >
                                                <span className="glyphicon glyphicon-collapse-down"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <p>
                                    Subtitle font size
                                </p>

                                <Slider
                                value={this.state.subTitleFontSize}
                                min={10}
                                max={200}
                                step={2}
                                orientation="horizontal"
                                onChange={this.handleSubTitleFontChange.bind(this)}
                                />

                            </div>
                        }

                        <canvas id="editor">
                            Update your browser
                        </canvas>

                        {this.state.img &&
                            <div className="align-center">
                                <button className="btn btn-primary" onClick={this.handleSaveResult.bind(this)}>
                                    Save result
                                </button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        );
    }
}

export default Drawing;
