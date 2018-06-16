import { List } from "immutable";
import * as React from "react";
import * as game from "../game";

import Cell from "./cell";

interface IBoardProps {
  board: game.Board;
  onReveal: (row: number, col: number) => void;
  onToggleFlag: (row: number, col: number) => void;
}

const rowStyle = {
  display: "flex"
};

export default class Board extends React.Component<IBoardProps> {
  public render() {
    return this.props.board.cells
      .map((row: List<game.ICell>, i: number) => (
        <div key={i} style={rowStyle}>
          {row
            .map((cell: game.ICell, j: number) => (
              <Cell
                key={j}
                {...cell}
                onReveal={this.props.onReveal.bind(this, i, j)}
                onToggleFlag={this.props.onToggleFlag.bind(this, i, j)}
              />
            ))
            .toArray()}
        </div>
      ))
      .toArray();
  }
}
