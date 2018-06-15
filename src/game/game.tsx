export type CellState = "flagged" | "concealed" | "revealed";

export interface ICell {
  bomb: boolean;
  neighbouringBombs: number;
  state: CellState;
}

type Pos = [number, number];

export function newGame(
  width: number,
  height: number,
  bombs: number
): ICell[][] {
  const bombLocations: number[] = [];
  for (let i = 0; i < bombs; i++) {
    while (true) {
      const loc = Math.floor(Math.random() * width * height);
      if (bombLocations.indexOf(loc) === -1) {
        bombLocations.push(loc);
        break;
      }
    }
  }

  const hasBomb = (row: number, col: number) => {
    if (row < 0 || row >= height || col < 0 || col >= width) {
      return false;
    }
    return bombLocations.indexOf(row * height + col) !== -1;
  };

  const calculateNeighbouringBombs = (row: number, col: number) => {
    let neighbouringBombs = 0;
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        neighbouringBombs += hasBomb(row + rowOffset, col + colOffset) ? 1 : 0;
      }
    }
    return neighbouringBombs;
  };

  const board: ICell[][] = [];
  for (let row = 0; row < height; row++) {
    const cells: ICell[] = [];
    for (let col = 0; col < width; col++) {
      const bomb = hasBomb(row, col);
      const neighbouringBombs = calculateNeighbouringBombs(row, col);
      cells.push({ bomb, neighbouringBombs, state: "concealed" });
    }
    board.push(cells);
  }
  return board;
}

export function updateCell(
  board: ICell[][],
  rowIndex: number,
  colIndex: number,
  state: CellState
): ICell[][] {
  const newBoard: ICell[][] = [];
  for (let row = 0; row < board.length; row++) {
    const oldCells = board[row];
    const cells: ICell[] = [];
    for (let col = 0; col < oldCells.length; col++) {
      if (row === rowIndex && col === colIndex) {
        cells.push({ ...oldCells[col], state });
      } else {
        cells.push(oldCells[col]);
      }
    }
    newBoard.push(cells);
  }
  if (state === "revealed") {
    return removeShroud(newBoard, [rowIndex, colIndex]);
  }
  return newBoard;
}

function removeShroud(board: ICell[][], startPos: Pos): ICell[][] {
  const cellsToReveal: Pos[] = [startPos];
  const cellsToCheck: Pos[] = [startPos];

  const isSafe = ([row, col]: Pos) => {
    if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
      return false;
    }
    const cell = board[row][col];
    return !cell.bomb && cell.neighbouringBombs === 0;
  };

  const shouldReveal = ([row, col]: Pos) =>
    cellsToReveal.findIndex(val => val[0] === row && val[1] === col) !== -1;

  while (cellsToCheck.length > 0) {
    const pos = cellsToCheck[0];
    cellsToCheck.shift();

    if (isSafe(pos)) {
      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          if (rowOffset === 0 && colOffset === 0) {
            continue;
          }

          const neighbour: Pos = [pos[0] + rowOffset, pos[1] + colOffset];
          if (!shouldReveal(neighbour)) {
            cellsToReveal.push(neighbour);
            if (isSafe(neighbour)) {
              cellsToCheck.push(neighbour);
            }
          }
        }
      }
    }
  }

  const newBoard: ICell[][] = [];
  for (let row = 0; row < board.length; row++) {
    const oldCells = board[row];
    const cells: ICell[] = [];
    for (let col = 0; col < oldCells.length; col++) {
      if (shouldReveal([row, col])) {
        cells.push({ ...oldCells[col], state: "revealed" });
      } else {
        cells.push(oldCells[col]);
      }
    }
    newBoard.push(cells);
  }
  return newBoard;
}

export function revealAll(board: ICell[][]): ICell[][] {
  const newBoard: ICell[][] = [];
  for (const row of board) {
    const cells: ICell[] = [];
    for (const cell of row) {
      cells.push({ ...cell, state: "revealed" });
    }
    newBoard.push(cells);
  }
  return newBoard;
}

export function checkSuccess(board: ICell[][]): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (cell.state === "concealed") {
        return false;
      }

      if (cell.state === "flagged" && !cell.bomb) {
        return false;
      }
    }
  }
  return true;
}
