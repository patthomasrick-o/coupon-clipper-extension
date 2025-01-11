import React from "react";
import { createRoot } from "react-dom/client";
import Utility from "./Utility";

const Popup = () => {
  return (
    <div>
      <button
        onClick={() => {
          Utility.getCurrentTab().then((tab) => {
            if (!tab.id) throw new Error("No tab");
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["cvs.js"],
            });
          });
        }}
      >
        Click to clip
      </button>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
