import React, { Component, PropTypes } from 'react';
import obelisk from 'obelisk.js';
import { WIDTH, HEIGHT } from '../constants';
import { to3D, rasterize, merge } from '../utils';

const UNIT = 16;
function scale(list) {
  return list.map(n => n * UNIT);
}

const CUBE_COLOR = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern.GRAY);
const color = ([dx, dy, dz]) => {
  const cache = {};
  return ([x, y, z]) => {
    if (typeof cache[z] === 'undefined') {
      const unit = Math.ceil(127 * (z / dz) + 128);
      const base = unit * 0x10000 + unit * 0x100 + 255;
      cache[z] = new obelisk.CubeColor().getByHorizontalColor(base);
    }
    return cache[z];
  };
};

const CUBE_DIM = new obelisk.CubeDimension(UNIT, UNIT, UNIT);
function cube(pos, c) {
  const box = new obelisk.Cube(CUBE_DIM, c, true);
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

    const { size } = this.props;
    if (!this.color) {
      this.color = color(size);
    }

    // Rasterize piece and merge to stage
    let stage;
    const { data, piece } = this.props;
    if (typeof piece.type === 'undefined') {
      stage = data;
    } else {
      const volume = rasterize(size, piece);
      stage = merge(data, volume);
    }

    // Draw stage
    const len = size[0] * size[1] * size[2];
    const translate = to3D.withDim(size);
    for (let i = 0; i < len; i++) {
      if (stage[i] === 1) {
        const pos = translate(i);
        this.view.renderObject(...cube(pos, this.color(pos)));
      }
    }
  }
}

Stage.displayName = 'Stage';
Stage.propTypes = {
  data: PropTypes.array.isRequired,
  size: PropTypes.array.isRequired,
  piece: PropTypes.object,
};
