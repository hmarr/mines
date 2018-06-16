import * as React from "react";
import * as game from "../game";
import Board from "./board";

interface IGameProps {
  width: number;
  height: number;
  bombs: number;
}

interface IGameState {
  game: game.Game;
}

const statusStyles = {
  lost: {
    background: "rgb(255, 220, 220)"
  },
  won: {
    background: "rgb(216, 255, 220)"
  }
};

export default class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps) {
    super(props);
    this.state = {
      game: game.Game.buildNew(
        this.props.width,
        this.props.height,
        this.props.bombs
      )
    };
  }

  public render() {
    return (
      <div style={statusStyles[this.state.game.state]}>
        <Board
          board={this.state.game.board}
          onReveal={this.handleReveal}
          onToggleFlag={this.handleToggleFlag}
        />
        <button onClick={this.handleReset}>Reset</button>
      </div>
    );
  }

  private handleReveal = (row: number, col: number) => {
    this.setState({ game: this.state.game.reveal(row, col) });
  };

  private handleToggleFlag = (row: number, col: number) => {
    this.setState({ game: this.state.game.toggleFlag(row, col) });
  };

  private handleReset = () => {
    this.setState({
      game: game.Game.buildNew(
        this.props.width,
        this.props.height,
        this.props.bombs
      )
    });
  };
}
