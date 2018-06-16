import { Board } from "./board";

type GameState = "won" | "lost" | "in-progress";

export class Game {
  public static buildNew(width: number, height: number, bombs: number) {
    return new Game(Board.buildNew(width, height, bombs));
  }

  public board: Board;
  public state: GameState;

  constructor(board: Board) {
    this.board = board;
    this.state = this.calculateState();
  }

  public reveal(row: number, col: number): Game {
    if (this.board.cellAt(row, col).bomb) {
      return new Game(this.board.revealAll());
    } else {
      return new Game(this.board.reveal(row, col));
    }
  }

  public toggleFlag(row: number, col: number): Game {
    return new Game(this.board.toggleFlag(row, col));
  }

  private calculateState(): GameState {
    for (let row = 0; row < this.board.height; row++) {
      for (let col = 0; col < this.board.width; col++) {
        const cell = this.board.cellAt(row, col);
        if (cell.bomb && cell.state === "revealed") {
          return "lost";
        }

        if (!cell.bomb) {
          if (cell.state === "concealed" || cell.state === "flagged") {
            return "in-progress";
          }
        }
      }
    }
    return "won";
  }
}