import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import { disableBodyScroll } from 'body-scroll-lock';
import Cookies from 'universal-cookie';
import { Slider } from 'material-ui-slider';
import classNames from 'classnames';

import { withRouter } from 'react-router-dom';
import Constants from '../../constants/Constants';

import Button from '../Button';

import './Painter.css';

const COLORS = ['red', 'yellow', 'blue'];

class Painter extends React.Component {

  cookies = new Cookies();

  constructor(props) {
    super(props);

    this.toRef = this.toRef.bind(this);
    disableBodyScroll(this.toRef);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.saveDrawing = this.saveDrawing.bind(this);
    this.undo = this.undo.bind(this);

    this.state = {
      activeColor: COLORS[0],
      activeBrushSize: 10,
      size: 10,
      toggleSizer: false,
      toggleColors: false
    };
  }

  toRef(el) {
    this.canvas = el;
  }

  componentDidMount() {
    if (this.canvas) {
      let canvas = this.canvas.canvas;
      let context = canvas.getContext('2d');
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  clearCanvas() {
    if (this.canvas) {
      this.canvas.clear();
    }
  }

  undo() {
    if (this.canvas) {
      this.canvas.undo();
    }
  }

  saveDrawing() {
    if (this.canvas) {
      window.drawingUrl = this.canvas.canvas.toDataURL('image/jpeg');
      var data = this.canvas.canvas.toDataURL('image/jpeg');
      var token = this.cookies.get('token');
      var request = new XMLHttpRequest();

      request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
          //do our stuff
          var response = request.responseText;
          console.log(response);
        }
      };

      request.open('POST', `${Constants.API_URL}/drawings/upload`, true);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      request.setRequestHeader('Authorization', 'Bearer ' + token);
      request.send('drawing=' + data);
      this.props.history.push('/counter');
    }
  }

  onChange = (value) => {
    if (value) {
      console.log(value);
      this.setState({
        activeBrushSize: value
      });
    }

  }

  onToggleSizer = () => {
    this.setState({
      toggleSizer: !this.state.toggleSizer
    })
  }

  onToggleColors = () => {
    console.log("togglings colors");
    this.setState({
      toggleColors: !this.state.toggleColors
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="draw-container " >
          <div className="header">
            <div className="dropdown">
              <div className="dropdown-header" onClick={this.onToggleColors}>
                <div className={classNames('swatch', { active: true })}
                  style={{ backgroundColor: this.state.activeColor }}/>

              </div>
              <div className="dropdown-content" hidden={!this.state.toggleColors}>
                <div className="colors">
                  {COLORS.map(color => (
                    <div key={color} className={classNames('swatch', { active: color === this.state.activeColor })}
                      style={{ backgroundColor: color }}
                      onClick={() => this.setState({ activeColor: color })} />
                  ))}
                </div>
              </div>
            </div>
            <div className="dropdown">
              <div className="dropdown-header">
                <div className="pencil-drop-icon" onClick={this.onToggleSizer}></div>
              </div>
              <div className="dropdown-content" hidden={!this.state.toggleSizer}>
                <div className="slider-container" >
                  <Slider
                    defaultValue={this.state.activeBrushSize}
                    onChange={this.onChange}>
                  </Slider>
                </div>
              </div>
            </div>
          </div>
          <div className="drawing-canvas-container " onTouchStart={() => this.setState({toggleColors: false, toggleSizer:false})}>
            <CanvasDraw
              ref={this.toRef}
              style={{ position: 'static' }}
              canvasWidth={window.innerWidth}
              canvasHeight={window.innerWidth}
              brushSize={this.state.activeBrushSize}
              brushColor={this.state.activeColor}
            />
          </div>
          <div className="button-bar">
            <Button handleClick={this.clearCanvas} buttonText="ȘTERGE" />
            <Button handleClick={this.undo} buttonText="ANULEAZĂ" />
            <Button handleClick={this.saveDrawing} buttonText="TRIMITE" />
          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default withRouter(Painter);
