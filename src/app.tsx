import * as React from "react";
import Game from "./components/game";

const containerStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  margin: 100,
  marginTop: 40
};

class App extends React.Component {
  public render() {
    return (
      <div style={containerStyle}>
        <Game width={9} height={9} bombs={10} />
      </div>
    );
  }
}

export default App;
