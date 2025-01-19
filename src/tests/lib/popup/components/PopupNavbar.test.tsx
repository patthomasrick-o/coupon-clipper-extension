import React from "react";
import { render } from "@testing-library/react";
import PopupNavbar from "../../../../popup/components/PopupNavbar.js";

test("demo", () => {
  expect(true).toBe(true);
});

test("Renders the main page", () => {
  render(<PopupNavbar />);
  expect(true).toBeTruthy();
});
