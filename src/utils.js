// @flow

declare type Triple = [number, number, number];
declare type Dimension = Triple;
declare type Position = Triple;
declare type Position1D = number;
declare type Piece = {
  type: number,
  position: Position,
  rotate?: any
};
declare type Stage = number[];

export function to1D(dim: Dimension, pos: Position): Position1D {
  const [x, y, z] = pos;
  const [dx, dy, dz] = dim;
  return dx * dy * z + dx * y + x;
}

to1D.withDim = function createTo1DWithDim(dim: Dimension) {
  return function to1DWithDim(pos: Position): Position1D {
    return to1D(dim, pos);
  };
};

export function to3D(dim: Dimension, pos: Position1D): Position {
  const [dx, dy, dz] = dim;
  const z = Math.floor(pos / (dx * dy));
  const y = Math.floor((pos % (dx * dy)) / dx);
  const x = (pos % (dx * dy)) % dx;
  return [x, y, z];
}

to3D.withDim = function createTo3DWithDim(dim: Dimension) {
  return function to3DWithDim(pos: Position1D): Position {
    return to3D(dim, pos);
  };
};

export function empty(dim: Dimension): Stage {
  const [dx, dy, dz] = dim;
  const size = dx * dy * dz;
  const stage = [];
  for (let i = 0; i < size; i++) {
    stage.push(0);
  }
  return stage;
}

export function rasterize(dim: Dimension, { type, position }: Piece): Stage {
  const e = empty(dim);
  const i = to1D(dim, position);
  e[i] = 1;
  return e;
}

export function zip<T, S>(a1: T[], a2: S[]): [[T, S]] {
  return a1.map((e, i) => [e, a2[i]]);
}

export function merge(s1: Stage, s2: Stage): Stage {
  const pairs = zip(s1, s2);
  return pairs.map(([a, b]) => 0 < a || 0 < b ? 1 : 0);
}

export function isValid(dim: Dimension, stage: Stage): bool {
  const [dx, dy, dz] = dim;
  return dx * dy * dz === stage.length;
}

export function rand(max: number): number {
  return Math.floor(max * Math.random());
}
