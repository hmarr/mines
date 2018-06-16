import { List } from "immutable";

export type CellState = "flagged" | "concealed" | "revealed";

export interface ICell {
  bomb: boolean;
  neighbouringBombs: number;
  state: CellState;
}

export type CellGrid = List<List<ICell>>;
type Location = [number, number];

export class Board {
  public static buildNew(width: number, height: number, bombs: number) {
    // Build the initial grid, assigning bomb locations
    const totalCells = width * height;
    let bombsRemaining = bombs;
    const initialCells = List<List<ICell>>().withMutations(
      (cells: CellGrid) => {
        for (let row = 0; row < height; row++) {
          for (let col = 0; col < width; col++) {
            const cellsRemaining = totalCells - (row * height + col);
            const bombChance = bombsRemaining / cellsRemaining;
            const bomb = Math.random() <= bombChance;
            if (bomb) {
              bombsRemaining -= 1;
            }
            const cell: ICell = {
              bomb,
              neighbouringBombs: 0,
              state: "concealed"
            };
            cells.setIn([row, col], cell);
          }
        }
      }
    );

    // Update neighbouring bomb counts
    const tempBoard = new Board(width, height, initialCells);
    const cellsWithCounts = tempBoard.cells.withMutations((cells: CellGrid) => {
      for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
          if (tempBoard.cellAt(row, col).bomb) {
            for (const loc of tempBoard.neighbourLocations(row, col)) {
              const neighbour = cells.getIn(loc);
              cells.setIn(loc, {
                ...neighbour,
                neighbouringBombs: neighbour.neighbouringBombs + 1
              });
            }
          }
        }
      }
    });
    return new Board(width, height, cellsWithCounts);
  }

  public width: number;
  public height: number;
  public cells: CellGrid;

  constructor(width: number, height: number, cells: CellGrid) {
    this.width = width;
    this.height = height;
    this.cells = cells;
  }

  public reveal(startRow: number, startCol: number): Board {
    const newCells = this.cells.withMutations((cells: CellGrid) => {
      const locationsToCheck: Location[] = [[startRow, startCol]];
      while (locationsToCheck.length > 0) {
        const [row, col] = locationsToCheck[0];
        locationsToCheck.shift();

        const cell = cells.getIn([row, col]);
        if (cell.bomb) {
          continue;
        }

        cells.setIn([row, col], { ...cell, state: "revealed" });

        if (cell.neighbouringBombs > 0) {
          continue;
        }

        for (const loc of this.neighbourLocations(row, col)) {
          if (cells.getIn(loc).state !== "revealed") {
            locationsToCheck.push(loc);
          }
        }
      }
    });
    return new Board(this.width, this.height, newCells);
  }

  public revealAll(): Board {
    const cells = this.cells
      .map((row: List<ICell>) =>
        row
          .map((cell: ICell): ICell => ({ ...cell, state: "revealed" }))
          .toList()
      )
      .toList();
    return new Board(this.width, this.height, cells);
  }

  public toggleFlag(row: number, col: number): Board {
    const cell: ICell = this.cellAt(row, col);
    const transitions = { concealed: "flagged", flagged: "concealed" };
    const state = transitions[cell.state] || cell.state;
    return new Board(
      this.width,
      this.height,
      this.cells.setIn([row, col], { ...cell, state })
    );
  }

  public cellAt(row: number, col: number): ICell {
    return this.cells.getIn([row, col]);
  }

  private neighbourLocations(row: number, col: number): Location[] {
    const locations: Location[] = [];
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (let colOffset = -1; colOffset <= 1; colOffset++) {
        if (rowOffset === 0 && colOffset === 0) {
          continue;
        }

        const nRow = row + rowOffset;
        const nCol = col + colOffset;
        if (nRow < 0 || nRow >= this.height || nCol < 0 || nCol >= this.width) {
          continue;
        }

        locations.push([nRow, nCol]);
      }
    }
    return locations;
  }
}

// export function checkSuccess(board: ICell[][]): boolean {
//   for (const row of board) {
//     for (const cell of row) {
//       if (cell.state === "concealed") {
//         return false;
//       }

//       if (cell.state === "flagged" && !cell.bomb) {
//         return false;
//       }
//     }
//   }
//   return true;
// }
