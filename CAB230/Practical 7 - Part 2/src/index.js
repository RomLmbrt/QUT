import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import App from "./components/App"

// React DOM mounting code below

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
