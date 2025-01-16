import React from "react";
import Utility from "./Utility";
import { Button, Container, Row, Col } from "react-bootstrap";
import { createRoot } from "react-dom/client";

import "./style/App.scss";

function onClipClick() {
  Utility.getCurrentTab().then((tab) => {
    if (!tab.id) throw new Error("No tab");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["cvs.js"],
    });
  });
}

const App = () => {
  return (
    <div className="coupon-clipper">
      <Row>
        <Col>
          <h1 className="text-light shake">FEED ME COUPONS 😈</h1>
          <Button className="shake" onClick={onClipClick}>
            EAT NOW
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
