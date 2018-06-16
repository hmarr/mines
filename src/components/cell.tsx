import * as React from "react";
import { CellState } from "../game";

interface ICellProps {
  bomb: boolean;
  neighbouringBombs: number;
  state: CellState;
  onReveal: () => void;
  onToggleFlag: () => void;
}

const baseStyle: React.CSSProperties = {
  alignItems: "center",
  border: "1px solid #eee",
  display: "flex",
  fontSize: 30,
  height: 30,
  justifyContent: "center",
  margin: 2,
  padding: 5,
  userSelect: "none",
  width: 30
};

const stateStyles = {
  [CellState.Concealed]: {
    background: "#eeeeee"
  },
  [CellState.Flagged]: {
    background: "#eeeeee"
  },
  [CellState.Revealed]: {
    background: "#ffffff"
  }
};

export default class Cell extends React.Component<ICellProps> {
  public render() {
    const style = { ...baseStyle, ...stateStyles[this.props.state] };
    return (
      <div
        style={style}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
      >
        {this.renderContent()}
      </div>
    );
  }

  private renderContent() {
    switch (this.props.state) {
      case CellState.Flagged:
        return "🚩";
      case CellState.Revealed:
        if (this.props.bomb) {
          return "💣";
        }

        if (this.props.neighbouringBombs === 0) {
          return "";
        }
        return this.props.neighbouringBombs;
      case CellState.Concealed:
        return "";
    }
  }

  private handleClick = () => {
    this.props.onReveal();
  };

  private handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    this.props.onToggleFlag();
  };
}
