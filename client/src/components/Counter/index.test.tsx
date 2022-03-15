import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";

import Counter from ".";

describe("components/Counter", () => {
  it("should increase the count when we click on the button", () => {
    render(<Counter />);
    fireEvent.click(screen.getByText("Click Me!"));
    screen.getByText("Times you clicked on the button: 1");
  });
});
