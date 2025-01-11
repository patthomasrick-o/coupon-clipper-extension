import React from "react";
import ReactDOM from "react-dom";

const Popup = () => {
  return (
    <div>
      <h1>Hello, Chrome Extension!</h1>
    </div>
  );
};

ReactDOM.createPortal(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
