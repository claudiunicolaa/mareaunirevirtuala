import React from 'react';
import CanvasDraw from 'react-canvas-draw';
import { disableBodyScroll } from 'body-scroll-lock';
import Cookies from 'universal-cookie';
import classNames from 'classnames';
import { Slider } from 'material-ui-slider';

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
      size: 10
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

  render() {
    return (
      <React.Fragment>
        <div className="slider-container">
          <Slider
            defaultValue={this.state.activeBrushSize}
            onChange={this.onChange}>
          </Slider>
        </div>
        <div className="colors">
          {COLORS.map(color => (
            <div key={color} className={classNames('swatch', { active: color === this.state.activeColor })}
              style={{ backgroundColor: color }}
              onClick={() => this.setState({ activeColor: color })} />
          ))}
        </div>
        <CanvasDraw
          ref={this.toRef}
          style={{ position: 'static' }}
          brushSize={this.state.activeBrushSize}
          brushColor={this.state.activeColor}
          canvasWidth={window.innerWidth}
          canvasHeight={window.innerHeight}
        />
        <div className="button-bar">
          <Button handleClick={this.clearCanvas} buttonText="ȘTERGE" />
          <Button handleClick={this.undo} buttonText="ANULEAZĂ" />
          <Button handleClick={this.saveDrawing} buttonText="TRIMITE" />
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Painter);
