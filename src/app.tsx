import * as React from "react";
import { Board } from "./components/board";

const containerStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  margin: 100
};

class App extends React.Component {
  public render() {
    return (
      <div style={containerStyle}>
        <Board width={10} height={10} bombs={10} />
      </div>
    );
  }
}

export default App;
