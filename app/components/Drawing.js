import React from 'react';
import DrawingStore from '../stores/DrawingStore';
import DrawingActions from '../actions/DrawingActions';
import {Link} from 'react-router';

// Extra components
import Dropzone from 'react-dropzone';
import Slider from 'react-rangeslider';
import { SketchPicker } from 'react-color';

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

        $(window).scroll(() => {
            if (window.scrollY >= $('canvas').offset().top + 20) {
                if (!$('canvas').hasClass('floating-box')) {
                    $('canvas').addClass('floating-box');
                    $('.floating-text').removeClass('hidden');
                    // window.scrollTo(0, 305);
                }
            } else {
                if ($('canvas').hasClass('floating-box') && window.scrollY <= 250) {
                    $('canvas').removeClass('floating-box');
                    $('.floating-text').addClass('hidden');
                    // window.scrollTo(0, 860);
                }
            }
        });

        $(document).keydown((e) => {
            if ($('input:focus').length === 0 && (e.which === 70 || e.which === 102)) {
                if (!$('canvas').hasClass('fullscreen-box')) {
                    $('canvas').addClass('fullscreen-box');
                }
            }
        });

        $(document).keyup((e) => {
            if ($('input:focus').length === 0 && (e.which === 70 || e.which === 102)) {
                if ($('canvas').hasClass('fullscreen-box')) {
                    $('canvas').removeClass('fullscreen-box');
                }
            }
        });
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
        files.forEach((file) => {
            // Convert to data url for further manipulations
            function convertFileToDataURLviaFileReader(url, callback) {
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
                $('#dropzone').find('div').text('Drop new image');
            });
        });
    }

    // Handle dropzone event for branding
    handleBrandingDrop(files) {
        files.forEach((file) => {
            // Convert to data url for further manipulations
            function convertFileToDataURLviaFileReader(url, callback) {
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
                this.handleBrandingChange('img', base64img);
                $('#dropzoneB').addClass('complete');
            });
        });
    }

    loadImageToCanvas(base64img) {
        // Get holder
        DrawingActions.updateEditor($('#editor')[0]);
        DrawingActions.updateContext(editor.getContext('2d'));
        DrawingActions.updateImage(new Image());

        // Set editor dimensions
        this.state.editor.width = 1920;
        this.state.editor.height = 1080;

        // load image
        this.state.img.src = base64img;

        // paste image to canvas
        this.state.img.onload = () => {
            this.state.ctx.drawImage(this.state.img, 0, 0, 1920, 1080);
        };
    }

    reloadCanvas() {
        this.state.ctx.drawImage(this.state.img, 0, 0, 1920, 1080);
    }

    redrawCanvas() {
        // wait a bit for complex values
        setTimeout(() => {
            // clear canvas first
            this.reloadCanvas();

            // perform checks and draw stuff
            if (this.state.overlay.opacity !== 0) {
                this.drawOverlay(this.state.overlay.opacity, this.state.overlay.color);
            }
            if (this.state.vignette.opacity !== 0) {
                this.drawVignette(this.state.vignette.size, this.state.vignette.opacity);
            }
            if (this.state.border !== 0) {
                this.drawFrame(this.state.border, this.state.padding, this.state.frameColor);
            }
            if (this.state.titleText.length !== 0) {
                this.drawText(this.state.titleText,
                              this.state.titleFontSize,
                              this.state.titleAlignment,
                              this.state.titleColor,
                              this.state.titleShift,
                              1);
            }
            if (this.state.subTitleText.length !== 0) {
                this.drawText(this.state.subTitleText,
                              this.state.subTitleFontSize,
                              this.state.subTitleAlignment,
                              this.state.subTitleColor,
                              this.state.subTitleShift,
                              2);
            }

            if (this.state.branding.img) {
                this.drawBranding(this.state.branding);
            }
        }, 50);
    }

    drawFrame(border, padding, color) {
        // set stroke color
        this.state.ctx.strokeStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';

        for (let i = border; i > 0; i--) {
            this.state.ctx.strokeRect(padding + i, padding + i, 1920 - padding * 2 - i * 2, 1080 - padding * 2 - i * 2);
        }
    }

    drawOverlay(opacity, color) {
        // set fill color
        this.state.ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + opacity + ')';

        this.state.ctx.fillRect(0, 0, 1920, 1080);
    }

    drawText(text, font, alignment, color, shift, position) {
        // set font
        this.state.ctx.font = font + 'px Bebas Neue Bold';

        // set fill color
        this.state.ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';

        // set text align
        this.state.ctx.textAlign = alignment.horizontal;

        // set text baseling
        this.state.ctx.textBaseline = alignment.vertical;

        // switch for proper positions
        let pos = {
            'h': 0,
            'v': 0,
        };
        switch (alignment.horizontal) {
        case 'left':
            pos.h = 80 + this.state.padding + this.state.border + shift.h;
            pos.v = 540 + shift.v;
            break;

        case 'center':
            pos.h = 960 + shift.h;
            pos.v = 540 + shift.v;
            break;

        case 'right':
            pos.h = 1840 - this.state.padding - this.state.border + shift.h;
            pos.v = 540 + shift.v;
            break;

        default:
            pos.h = 960 + shift.h;
            pos.v = 540 + shift.v;
            break;
        }

        if (position === 1) {
            this.state.ctx.fillText(text, pos.h, pos.v);
        } else {
            this.state.ctx.fillText(text, pos.h, pos.v);
        }
    }

    drawVignette(size, opacity) {
        let grd = this.state.ctx.createRadialGradient(960, 540, 600 - size, 960, 540, 1600 - size);
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(1, 'rgba(0,0,0,' + opacity + ')');

        this.state.ctx.fillStyle = grd;
        this.state.ctx.fillRect(0, 0, 1920, 1080);
    }

    drawBranding(branding) {
        this.state.ctx.globalAlpha = branding.opacity;
        this.state.ctx.drawImage(branding.img,
                                 branding.align === 'left' ?
                                 branding.h
                                 + this.state.padding
                                 + this.state.border
                                 + 80
                                 :
                                 1920
                                 + branding.h
                                 - branding.img.width
                                 * branding.scale
                                 - this.state.padding
                                 - this.state.border
                                 - 80,
                                 branding.valign === 'top' ?
                                 branding.v
                                 + this.state.padding
                                 + this.state.border
                                 + 80
                                 :
                                 1080
                                 + branding.v
                                 - branding.img.height
                                 * branding.scale
                                 - this.state.padding
                                 - this.state.border
                                 - 80,
                                 branding.img.width * branding.scale,
                                 branding.img.height * branding.scale
                                );
        this.state.ctx.globalAlpha = 1;
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

    handleOverlayChange(type, value) {
        if (type === 'opacity') {
            DrawingActions.updateOverlay({
                'opacity': value,
                'color': this.state.overlay.color,
            });
        } else {
            DrawingActions.updateOverlay({
                'opacity': this.state.overlay.opacity,
                'color': value.rgb,
            });
        }
        this.redrawCanvas();
    }

    handleVignetteChange(type, value) {
        if (type === 'opacity') {
            DrawingActions.updateVignette({
                'opacity': value instanceof Object ? parseInt(value.target.value) : value,
                'size': this.state.vignette.size,
            });
        } else {
            DrawingActions.updateVignette({
                'opacity': this.state.vignette.opacity,
                'size': value instanceof Object ? parseInt(value.target.value) : value,
            });
        }
        this.redrawCanvas();
    }

    handleTitleFontChange(value) {
        DrawingActions.updateTitleFontSize(value instanceof Object ? parseInt(value.target.value) : value);
        this.redrawCanvas();
    }

    handleTitleTextChange(event) {
        DrawingActions.updateTitleText(event.target.value);
        this.redrawCanvas();
    }

    handleTitleAlignmentChange(type, alignment) {
        if (type === 1) {
            DrawingActions.updateTitleAlignment({
                'horizontal': alignment instanceof Object ? parseInt(value.target.value) : alignment,
                'vertical': this.state.titleAlignment.vertical,
            });
        } else {
            DrawingActions.updateTitleAlignment({
                'horizontal': this.state.titleAlignment.horizontal,
                'vertical': alignment instanceof Object ? parseInt(value.target.value) : alignment,
            });
        }
        this.redrawCanvas();
    }

    handleSubTitleFontChange(value) {
        DrawingActions.updateSubTitleFontSize(value instanceof Object ? parseInt(value.target.value) : value);
        this.redrawCanvas();
    }

    handleSubTitleTextChange(event) {
        DrawingActions.updateSubTitleText(event.target.value);
        this.redrawCanvas();
    }

    handleSubTitleAlignmentChange(type, alignment) {
        if (type === 1) {
            DrawingActions.updateSubTitleAlignment({
                'horizontal': alignment instanceof Object ? parseInt(value.target.value) : alignment,
                'vertical': this.state.subTitleAlignment.vertical,
            });
        } else {
            DrawingActions.updateSubTitleAlignment({
                'horizontal': this.state.subTitleAlignment.horizontal,
                'vertical': alignment instanceof Object ? parseInt(value.target.value) : alignment,
            });
        }
        this.redrawCanvas();
    }

    handleTitleColorChange(color) {
        DrawingActions.updateTitleColor(color.rgb);
        this.redrawCanvas();
    }

    handleSubTitleColorChange(color) {
        DrawingActions.updateSubTitleColor(color.rgb);
        this.redrawCanvas();
    }

    handleFrameColorChange(color) {
        DrawingActions.updateFrameColor(color.rgb);
        this.redrawCanvas();
    }

    handleTitleShiftChange(type, value) {
        if (type === 1) {
            DrawingActions.updateTitleShift({
                'h': value instanceof Object ? parseInt(value.target.value) : value,
                'v': this.state.titleShift.v,
            });
        } else {
            DrawingActions.updateTitleShift({
                'h': this.state.titleShift.h,
                'v': value instanceof Object ? parseInt(value.target.value) : value,
            });
        }
        this.redrawCanvas();
    }

    handleSubTitleShiftChange(type, value) {
        if (type === 1) {
            DrawingActions.updateSubTitleShift({
                'h': value instanceof Object ? parseInt(value.target.value) : value,
                'v': this.state.subTitleShift.v,
            });
        } else {
            DrawingActions.updateSubTitleShift({
                'h': this.state.subTitleShift.h,
                'v': value instanceof Object ? parseInt(value.target.value) : value,
            });
        }
        this.redrawCanvas();
    }

    handleBrandingChange(type, value) {
        switch (type) {

        case 'img':
            this.state.branding.img = new Image();
            this.state.branding.img.src = value;
            this.state.branding.img.onload = () => {
                DrawingActions.updateBranding(this.state.branding);
                this.redrawCanvas();
            };
            break;

        case 'horizontal':
            this.state.branding.h = value instanceof Object ? parseInt(value.target.value) : value;
            break;

        case 'vertical':
            this.state.branding.v = value instanceof Object ? parseInt(value.target.value) : value;
            break;

        case 'opacity':
            this.state.branding.opacity = value instanceof Object ? parseInt(value.target.value) : value;
            break;

        case 'align':
            this.state.branding.align = value;
            break;

        case 'valign':
            this.state.branding.valign = value;
            break;

        case 'scale':
            this.state.branding.scale = value instanceof Object ? parseInt(value.target.value) : value;
            break;

        default:
            break;
        }

        if (type !== 'img') {
            DrawingActions.updateBranding(this.state.branding);
            this.redrawCanvas();
        }
    }

    handleMoveCanvas(state) {
        if (state) {
            if ($(window).width() < 1714) {
                $('canvas').addClass('moved');

                // check if canvas is floating
                if ($('canvas').hasClass('floating-box')) {
                    $('.floating-text').addClass('hidden');
                }
            }
        } else {
            $('canvas').removeClass('moved');
            // check if canvas is floating
            if ($('canvas').hasClass('floating-box')) {
                $('.floating-text').removeClass('hidden');
            }
        }
    }

    handleSaveResult() {
        this.downloadURI(this.state.editor.toDataURL('image/jpeg', 0.8), 'thumbnail.jpg');
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

                        <canvas id="editor">
                            Update your browser
                        </canvas>
                        <div className="floating-text hidden">
                            Press "F" for fullscreen preview
                        </div>

                        <br /><br />

                        {this.state.img &&
                            <div>
                                <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="panel panel-default"
                                    onMouseOver={this.handleMoveCanvas.bind(this, true)}
                                    onMouseOut={this.handleMoveCanvas.bind(this, false)}
                                    >
                                        <div className="panel-heading">
                                            Background options
                                        </div>
                                        <div className="panel-body">
                                            <p>
                                                Vignette opacity
                                            </p>
                                            <Slider
                                            value={this.state.vignette.opacity}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            orientation="horizontal"
                                            onChange={this.handleVignetteChange.bind(this, 'opacity')}
                                            />

                                            <p>
                                                Vignette size
                                            </p>

                                            <Slider
                                            value={this.state.vignette.size}
                                            min={-600}
                                            max={600}
                                            step={4}
                                            orientation="horizontal"
                                            onChange={this.handleVignetteChange.bind(this, 'size')}
                                            />

                                            <p>
                                                Overlay opacity
                                            </p>

                                            <Slider
                                            value={this.state.overlay.opacity}
                                            min={0}
                                            max={1}
                                            step={0.05}
                                            orientation="horizontal"
                                            onChange={this.handleOverlayChange.bind(this, 'opacity')}
                                            />

                                            <p>
                                                Overlay color
                                            </p>

                                            <SketchPicker
                                            color={this.state.overlay.color}
                                            onChange={this.handleOverlayChange.bind(this, 'color')}
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            Frame options
                                        </div>
                                        <div className="panel-body">

                                            <p>
                                                Frame size
                                            </p>

                                            <Slider
                                            value={this.state.border}
                                            min={0}
                                            max={100}
                                            step={1}
                                            orientation="horizontal"
                                            onChange={this.handleBorderChange.bind(this)}
                                            />

                                            <p>
                                                Frame padding (distance from edges)
                                            </p>

                                            <Slider
                                            value={this.state.padding}
                                            min={0}
                                            max={100}
                                            step={1}
                                            orientation="horizontal"
                                            onChange={this.handlePaddingChange.bind(this)}
                                            />

                                            <p>
                                                Frame color
                                            </p>

                                            <SketchPicker
                                            color={this.state.frameColor}
                                            onChange={this.handleFrameColorChange.bind(this)}
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="clearfix"></div>

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            Title options
                                        </div>
                                        <div className="panel-body">
                                            <p>
                                                Title Text
                                            </p>

                                            <div className="form-group">
                                                <div className="input-group">
                                                    <div className="input-group-btn aligments">
                                                        <button className="btn btn-default"
                                                        onClick={this.handleTitleAlignmentChange.bind(this, 1, 'left')}
                                                        >
                                                            <span className="glyphicon glyphicon-align-left"></span>
                                                        </button>
                                                        <button className="btn btn-default"
                                                        onClick={this.handleTitleAlignmentChange.bind(this, 1, 'center')}
                                                        >
                                                            <span className="glyphicon glyphicon-align-center"></span>
                                                        </button>
                                                        <button className="btn btn-default"
                                                        onClick={this.handleTitleAlignmentChange.bind(this, 1, 'right')}
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
                                                    <div className="input-group-btn aligments">
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

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Title font size
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.titleFontSize}
                                                    onChange={this.handleTitleFontChange.bind(this)}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.titleFontSize}
                                            min={10}
                                            max={402}
                                            step={3}
                                            orientation="horizontal"
                                            onChange={this.handleTitleFontChange.bind(this)}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Title horizontal shift
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.titleShift.h}
                                                    onChange={this.handleTitleShiftChange.bind(this, 1)}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.titleShift.h}
                                            min={-400}
                                            max={400}
                                            step={2}
                                            orientation="horizontal"
                                            onChange={this.handleTitleShiftChange.bind(this, 1)}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Title vertical shift
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.titleShift.v}
                                                    onChange={this.handleTitleShiftChange.bind(this, 2)}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.titleShift.v}
                                            min={-400}
                                            max={400}
                                            step={2}
                                            orientation="horizontal"
                                            onChange={this.handleTitleShiftChange.bind(this, 2)}
                                            />

                                            <p>
                                                Title color
                                            </p>

                                            <SketchPicker
                                            color={this.state.titleColor}
                                            onChange={this.handleTitleColorChange.bind(this)}
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            Subtitle options
                                        </div>
                                        <div className="panel-body">

                                            <p>
                                                Subtitle Text
                                            </p>

                                            <div className="form-group">
                                                <div className="input-group">
                                                    <div className="input-group-btn aligments">
                                                        <button className="btn btn-default"
                                                        onClick={this.handleSubTitleAlignmentChange.bind(this, 1, 'left')}
                                                        >
                                                            <span className="glyphicon glyphicon-align-left"></span>
                                                        </button>
                                                        <button className="btn btn-default"
                                                        onClick={this.handleSubTitleAlignmentChange.bind(this, 1, 'center')}
                                                        >
                                                            <span className="glyphicon glyphicon-align-center"></span>
                                                        </button>
                                                        <button className="btn btn-default"
                                                        onClick={this.handleSubTitleAlignmentChange.bind(this, 1, 'right')}
                                                        >
                                                            <span className="glyphicon glyphicon-align-right"></span>
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={this.state.subTitleText}
                                                        placeholder="Second line of text e.g. video title"
                                                        onChange={this.handleSubTitleTextChange.bind(this)}
                                                    />
                                                    <div className="input-group-btn aligments">
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

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Subtitle font size
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.subTitleFontSize}
                                                    onChange={this.handleSubTitleFontChange.bind(this)}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.subTitleFontSize}
                                            min={10}
                                            max={402}
                                            step={3}
                                            orientation="horizontal"
                                            onChange={this.handleSubTitleFontChange.bind(this)}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Subtitle horizontal shift
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.subTitleShift.h}
                                                    onChange={this.handleSubTitleShiftChange.bind(this, 1)}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.subTitleShift.h}
                                            min={-400}
                                            max={400}
                                            step={2}
                                            orientation="horizontal"
                                            onChange={this.handleSubTitleShiftChange.bind(this, 1)}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Subtitle vertical shift
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.subTitleShift.v}
                                                    onChange={this.handleSubTitleShiftChange.bind(this, 2)}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.subTitleShift.v}
                                            min={-400}
                                            max={400}
                                            step={2}
                                            orientation="horizontal"
                                            onChange={this.handleSubTitleShiftChange.bind(this, 2)}
                                            />

                                            <p>
                                                Subtitle color
                                            </p>

                                            <SketchPicker
                                            color={this.state.subTitleColor}
                                            onChange={this.handleSubTitleColorChange.bind(this)}
                                            />

                                        </div>
                                    </div>
                                </div>

                                <div className="clearfix"></div>

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="panel panel-default">
                                        <div className="panel-heading">
                                            Branding options
                                        </div>
                                        <div className="panel-body">

                                            <p>
                                                Branding image
                                            </p>

                                            <Dropzone
                                            id={'dropzoneB'}
                                            className="dropzone"
                                            onDrop={this.handleBrandingDrop.bind(this)}
                                            accept="image/*"
                                            >
                                                <div>Drop an image</div>
                                            </Dropzone>

                                            <p>
                                                Image alignment
                                            </p>

                                            <div className="btn-group">
                                                <button
                                                className="btn btn-default"
                                                onClick={this.handleBrandingChange.bind(this, 'align', 'left')}
                                                >
                                                Left
                                                </button>
                                                <button
                                                className="btn btn-default"
                                                onClick={this.handleBrandingChange.bind(this, 'align', 'right')}
                                                >
                                                Right
                                                </button>
                                                <button
                                                className="btn btn-default"
                                                onClick={this.handleBrandingChange.bind(this, 'valign', 'top')}
                                                >
                                                Top
                                                </button>
                                                <button
                                                className="btn btn-default"
                                                onClick={this.handleBrandingChange.bind(this, 'valign', 'bottom')}
                                                >
                                                Bottom
                                                </button>
                                            </div>

                                            <div className="clearfix"></div>
                                            <br />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Image horizontal shift
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.branding.h}
                                                    onChange={this.handleBrandingChange.bind(this, 'horizontal')}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.branding.h}
                                            min={-400}
                                            max={400}
                                            step={2}
                                            orientation="horizontal"
                                            onChange={this.handleBrandingChange.bind(this, 'horizontal')}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Image vertical shift
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.branding.v}
                                                    onChange={this.handleBrandingChange.bind(this, 'vertical')}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.branding.v}
                                            min={-400}
                                            max={400}
                                            step={2}
                                            orientation="horizontal"
                                            onChange={this.handleBrandingChange.bind(this, 'vertical')}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Image opacity
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.branding.opacity}
                                                    onChange={this.handleBrandingChange.bind(this, 'opacity')}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.branding.opacity}
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            orientation="horizontal"
                                            onChange={this.handleBrandingChange.bind(this, 'opacity')}
                                            />

                                            <div className="form-inline">
                                                <div className="form-group">
                                                    <label>
                                                        Image scale
                                                    </label>
                                                    <input
                                                    type="text"
                                                    className="form-control"
                                                    value={this.state.branding.scale}
                                                    onChange={this.handleBrandingChange.bind(this, 'scale')}
                                                    />
                                                </div>
                                            </div>

                                            <Slider
                                            value={this.state.branding.scale}
                                            min={0}
                                            max={3}
                                            step={0.05}
                                            orientation="horizontal"
                                            onChange={this.handleBrandingChange.bind(this, 'scale')}
                                            />

                                        </div>
                                    </div>
                                </div>

                            </div>
                        }

                        {this.state.img &&
                            <div>
                                <div className="clearfix"></div>
                                <div className="align-center">
                                    <button className="btn btn-primary" style={{'width': '100%'}} onClick={this.handleSaveResult.bind(this)}>
                                        Save result
                                    </button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        );
    }
}

export default Drawing;
