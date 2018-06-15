import * as React from "react";
import {
  CellState,
  ICell,
  checkSuccess,
  newGame,
  revealAll,
  updateCell
} from "../game/game";
import Cell from "./cell";

interface IBoardProps {
  width: number;
  height: number;
  bombs: number;
}

interface IBoardState {
  cells: ICell[][];
  success: boolean;
}

const rowStyle = {
  display: "flex"
};

const successStyle = {
  background: "rgb(216, 255, 220)"
};

export class Board extends React.Component<IBoardProps, IBoardState> {
  constructor(props: IBoardProps) {
    super(props);
    this.state = {
      cells: newGame(this.props.width, this.props.height, this.props.bombs),
      success: false
    };
  }

  public render() {
    return (
      <div style={this.state.success ? successStyle : undefined}>
        {this.renderRows()}
      </div>
    );
  }

  private renderRows() {
    return this.state.cells.map((row, i) => (
      <div key={i} style={rowStyle}>
        {row.map((cell, j) => (
          <Cell
            key={j}
            {...cell}
            onUpdate={this.handleUpdate.bind(this, i, j)}
            onRevealAll={this.handleRevealAll}
          />
        ))}
      </div>
    ));
  }

  private handleUpdate(row: number, col: number, state: CellState) {
    console.log(row, col);
    const newState = updateCell(this.state.cells, row, col, state);
    const success = checkSuccess(newState);
    this.setState({ cells: newState, success });
  }

  private handleRevealAll = () => {
    this.setState({ cells: revealAll(this.state.cells) });
  };
}
