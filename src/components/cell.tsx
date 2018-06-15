import * as React from "react";
import { CellState } from "../game/game";

interface ICellProps {
  bomb: boolean;
  neighbouringBombs: number;
  state: CellState;
  onUpdate: (state: CellState) => void;
  onRevealAll: () => void;
}

const cellStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  fontSize: 30,
  height: 30,
  justifyContent: "center",
  padding: 5,
  userSelect: "none",
  width: 30
};

export default class Cell extends React.Component<ICellProps> {
  public render() {
    return (
      <div
        style={cellStyle}
        onClick={this.handleClick}
        onContextMenu={this.handleContextMenu}
      >
        {this.renderContent()}
      </div>
    );
  }

  private renderContent() {
    switch (this.props.state) {
      case "flagged":
        return "🚩";
      case "revealed":
        if (this.props.bomb) {
          return "💣";
        }

        switch (this.props.neighbouringBombs) {
          case 0:
            return "🕸";
          case 1:
            return "1️⃣";
          case 2:
            return "2️⃣";
          case 3:
            return "3️⃣";
          case 4:
            return "4️⃣";
          case 5:
            return "5️⃣";
          case 6:
            return "6️⃣";
          case 7:
            return "7️⃣";
          case 8:
            return "8️⃣";
        }
      case "concealed":
        return "🌫";
    }
  }

  private handleClick = () => {
    if (this.props.bomb) {
      this.props.onRevealAll();
    } else {
      this.props.onUpdate("revealed");
    }
  };

  private handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    switch (this.props.state) {
      case "concealed":
        this.props.onUpdate("flagged");
        break;
      case "flagged":
        this.props.onUpdate("concealed");
        break;
    }
  };
}
