import React, { Component, PropTypes } from 'react';
import obelisk from 'obelisk.js';
import { WIDTH, HEIGHT } from '../constants';
import { to3D } from '../utils';

const UNIT = 16;
function scale(list) {
  return list.map(n => n * UNIT);
}

const CUBE_DIM = new obelisk.CubeDimension(UNIT, UNIT, UNIT);
const CUBE_COLOR = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern.GRAY);
function cube(pos) {
  const box = new obelisk.Cube(CUBE_DIM, CUBE_COLOR, true);
  const point = new obelisk.Point3D(...scale(pos));
  return [box, point];
}

export default class Stage extends Component {
  componentDidUpdate() {
    this.renderObelisk();
  }

  render() {
    return <canvas ref="canvas" width={WIDTH} height={HEIGHT}></canvas>;
  }

  renderObelisk() {
    if (!this.refs.canvas) {
      return;
    }

    if (this.refs.canvas && !this.view) {
      const point = new obelisk.Point(200, 200);
      this.view = new obelisk.PixelView(this.refs.canvas, point);
    } else {
      this.view.clear();
    }

    // Draw stage
    const { data, size } = this.props;
    const len = size[0] * size[1] * size[2];
    const translate = to3D.withDim(size);
    for (let i = 0; i < len; i++) {
      if (data[i] === 1) {
        this.view.renderObject(...cube(translate(i)));
      }
    }

    // Draw piece
    const { piece } = this.props;

    if (typeof piece.type !== 'undefined') {
      this.view.renderObject(...cube(piece.position));
    }
  }
}

Stage.displayName = 'Stage';
Stage.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.array.isRequired,
  piece: PropTypes.object,
};
