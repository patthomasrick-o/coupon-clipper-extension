import React from "react";
import Utility from "./Utility";
import { Button, Row, Col } from "react-bootstrap";
import { createRoot } from "react-dom/client";

import "./style/Popup.scss";

function onClipClick() {
  Utility.getCurrentTab().then((tab) => {
    if (!tab.id) throw new Error("No tab");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["clipper.js"],
    });
  });
}

const Popup = () => {
  return (
    <div className="coupon-clipper">
      <Row>
        <Col>
          <h1 className="text-light">Clipper</h1>
          <Button onClick={onClipClick}>Clip</Button>
        </Col>
      </Row>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
