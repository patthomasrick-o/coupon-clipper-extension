import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { createRoot } from "react-dom/client";

import PopupNavbar from "./components/PopupNavbar.js";
import "./style/Popup.scss";
import Utility from "./Utility.js";

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
      <PopupNavbar />
      <Container className="coupon-clipper-content">
        <Row>
          <Col>
            <h1 className="text-light">Clipper</h1>
            <Button onClick={onClipClick}>Clip</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
