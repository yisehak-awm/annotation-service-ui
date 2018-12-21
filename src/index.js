import "../node_modules/antd/dist/antd.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { AnnotationService } from "./components/annotation-service";

class App extends React.Component {
  render() {
    return (
      <div>
        <AnnotationService />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
