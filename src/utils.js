// @flow

declare type Triple = [number, number, number];
declare type Dimension = Triple;
declare type Position = Triple;
declare type Position1D = number;
declare type PieceType = number;
declare type Piece = {
  type: PieceType,
  position: Position,
  rotate?: any
};
declare type Stage = number[];
declare type DirName = 'back' | 'right' | 'front' | 'left' | 'up' | 'down';
declare type Dir = -1 | 0 | 1;
declare type Direction = [Dir, Dir, Dir];
declare type Range = [number, number];

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
  return range(size).map(i => 0);
}

const PIECES = {
  '1': [[0, 0, 0]],
  '2': [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]],
  '3': [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]],
  '4': [[0, 0, 0], [1, 0, 0], [2, 0, 0], [2, 1, 0]],
  '5': [[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 1, 0]],
};

export function numCubesByType(type: PieceType) {
  const cubes = PIECES[type.toString()];
  if (typeof cubes === 'undefined') {
    throw new Error(`Unknown piece type: ${type}`);
  }

  return cubes.length;
}

export function rasterize(dim: Dimension, { type, position: base }: Piece): Stage {
  const cubes = PIECES[type.toString()];
  if (typeof cubes === 'undefined') {
    throw new Error(`Unknown piece type: ${type}`);
  }

  const to = to1D.withDim(dim);
  const inStage = isInStage.withDim(dim);
  let stage = empty(dim);
  for (let cube of cubes) {
    const pos = add(base, cube);
    if (inStage(pos)) {
      stage[to(pos)] = 1;
    }
  }

  return stage;
}

export function zip<T, S>(a1: T[], a2: S[]): [[T, S]] {
  return a1.map((e, i) => [e, a2[i]]);
}

export function merge(s1: Stage, s2: Stage): Stage {
  return zip(s1, s2).map(([a, b]) => 0 < a || 0 < b ? 1 : 0);
}

export function hasIntersection(s1: Stage, s2: Stage): bool {
  return 0 < zip(s1, s2).filter(([a, b]) => a === 1 && b === 1).length;
}

export function add(v1: number[], v2: number[]): number[] {
  return zip(v1, v2).map(([a, b]) => a + b);
}

export function isInStage(dim: Dimension, pos: Position): bool {
  const [dx, dy, dz] = dim;
  const [x, y, z] = pos;
  return 0 <= x && x < dx && 0 <= y && y < dy && 0 <= z && z < dz;
}

isInStage.withDim = function createIsInStage(dim: Dimension) {
  return function isInStageWithDim(pos: Position): bool {
    return isInStage(dim, pos);
  }
}

export function isValid(dim: Dimension, stage: Stage): bool {
  const [dx, dy, dz] = dim;
  return dx * dy * dz === stage.length;
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

export function move(piece: Piece, dir: DirName): Piece {
  return { ...piece, position: add(piece.position, dirToVec(dir)) };
}

export function canMove(dim: Dimension, stage: Stage, piece: Piece, dir: DirName): bool {
  const num = numCubesByType(piece.type);
  const newPiece = move(piece, dir);
  const volume = rasterize(dim, newPiece);
  return numCubes(dim, volume) === num && !hasIntersection(stage, volume);
}

export function range(n: number): number[] {
  const list = [];
  for (let i = 0; i < n; i++) {
    list.push(i);
  }
  return list;
}

// volume: Rasterized piece
export function eachCubes(dim: Dimension, volume: Stage): Position[] {
  if (dim[0] === 0 || dim[1] === 0 || dim[2] === 0) {
    return [];
  }
  const to = to3D.withDim(dim);
  return volume.map((d, i) => [i, d])
    .filter(([i, d]) => d === 1).map(([i, d]) => to(i));
}

export function numCubes(dim: Dimension, volume: Stage): number {
  return eachCubes(dim, volume).length;
}

export function rand(max: number): number {
  return Math.floor(max * Math.random());
}

export function sliceX(dim: Dimension, volume: Stage, [begin, end]: Range): Stage {
  const to = to3D.withDim(dim);
  const newVol = [];
  volume.forEach((d, i) => {
    const [x, y, z] = to(i);
    if (begin <= x && x < end) {
      newVol.push(d);
    }
  });
  return newVol;
}

export function sliceY(dim: Dimension, volume: Stage, [begin, end]: Range): Stage {
  const to = to3D.withDim(dim);
  const newVol = [];
  volume.forEach((d, i) => {
    const [x, y, z] = to(i);
    if (begin <= y && y < end) {
      newVol.push(d);
    }
  });
  return newVol;
}

export function sliceZ(dim: Dimension, volume: Stage, [begin, end]: Range): Stage {
  const to = to3D.withDim(dim);
  const newVol = [];
  volume.forEach((d, i) => {
    const [x, y, z] = to(i);
    if (begin <= z && z < end) {
      newVol.push(d);
    }
  });
  return newVol;
}

export function shrink(dim: Dimension, volume: Stage): Dimension {
  const count = eachCubes(dim, volume).length;
  let [dx, dy, dz] = dim;

  // X
  const rx = [0, dx];
  while (rx[0] < rx[1]) {
    const rx0 = rx[0] + 1;
    if (numCubes([rx[1] - rx0, dy, dz], sliceX(dim, volume, [rx0, rx[1]])) < count) {
      break;
    }
    rx[0] = rx0;
  }
  while (rx[0] < rx[1]) {
    const rx1 = rx[1] - 1;
    if (numCubes([rx1 - rx[0], dy, dz], sliceX(dim, volume, [rx[0], rx1])) < count) {
      break;
    }
    rx[1] = rx1;
  }

  // Y
  const ry = [0, dy];
  while (ry[0] < ry[1]) {
    const ry0 = ry[0] + 1;
    if (numCubes([rx[1] - rx[0], ry[1] - ry0, dz], sliceY(dim, volume, [ry0, ry[1]])) < count) {
      break;
    }
    ry[0] = ry0;
  }
  while (ry[0] < ry[1]) {
    const ry1 = ry[1] - 1;
    if (numCubes([rx[1] - rx[0], ry1 - ry[0], dz], sliceY(dim, volume, [ry[0], ry1])) < count) {
      break;
    }
    ry[1] = ry1;
  }

  // Z
  const rz = [0, dz];
  while (rz[0] < rz[1]) {
    const rz0 = rz[0] + 1;
    if (numCubes([rx[1] - rx[0], ry[1] - ry[0], rz[1] - rz0], sliceZ(dim, volume, [rz0, rz[1]])) < count) {
      break;
    }
    rz[0] = rz0;
  }
  while (rz[0] < rz[1]) {
    const rz1 = rz[1] - 1;
    if (numCubes([rx[1] - rx[0], ry[1] - ry[0], rz1 - rz[0]], sliceZ(dim, volume, [rz[0], rz1])) < count) {
      break;
    }
    rz[1] = rz1;
  }

  return [rx[1] - rx[0], ry[1] - ry[0], rz[1] - rz[0]];
}
