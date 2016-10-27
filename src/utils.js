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
declare type DirName = 'back' | 'right' | 'front' | 'left' | 'up' | 'down';
declare type Dir = -1 | 0 | 1;
declare type Direction = [Dir, Dir, Dir];

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

export function dirToVec(dir: DirName): Direction {
  switch (dir) {
    case 'back':
      return [ 0, -1,  0];
    case 'right':
      return [ 1,  0,  0];
    case 'front':
      return [ 0,  1,  0];
    case 'left':
      return [-1,  0,  0];
    case 'up':
      return [ 0,  0,  1];
    case 'down':
      return [ 0,  0, -1];
  }
  throw new Error(`Invalid direction: ${dir}`);
}

export function pad<T>(v: T[], len: number, padding: T): T[] {
  v = [...v];
  while (v.length < len) {
    v.push(padding);
  }
  return v;
}

export function add<T>(v1: T[], v2: T[], padding: T): T[] {
  const l = Math.max(v1.length, v2.length);
  return zip(pad(v1, l, padding), pad(v2, l, padding)).map(([a, b]) => a + b);
}

export function move(pos: Position, dir: DirName): Position {
  return add(pos, dirToVec(dir), 0);
}

export function range(n) {
  const list = [];
  for (let i = 0; i < n; i++) {
    list.push(i);
  }
  return list;
}

export function eachZ(dim: Dimension, stage: Stage) {
  const [dx, dy, dz] = dim;
  const u = dx * dy;
  return range(dz).map(i => stage.slice(i * u, (i + 1) * u));
}

// volume: Rasterized piece
export function eachCubes(dim: Dimension, volume: Stage): Position[] {
  const convert = to3D.withDim(dim);
  return volume.map((d, i) => [i, d])
    .filter(([i, d]) => d === 1).map(([i, d]) => convert(i));
}

export function isExist(dim: Dimension, stage: Stage, pos: Position, dir: DirName): bool {
  
}

export function isGrounded(dim: Dimension, stage: Stage, piece: Piece): bool {
  const volume = rasterize(dim, piece);
  for (let pos of eachCubes(dim, volume)) {
    
  }
}
