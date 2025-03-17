import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import matchers
import AutoComplete from "./AutoComplete";

describe("AutoComplete Component", () => {
  const mockSetValue = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleClick = jest.fn();
  const autoCompleteData = ["apple", "banana", "grape", "orange"];

  const setup = () => {
    render(
      <AutoComplete
        value=""
        setValue={mockSetValue}
        autoComplete={autoCompleteData}
        handleChange={mockHandleChange}
        handleClick={mockHandleClick}
      />
    );
  };

  it("renders without crashing", () => {
    setup();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("hides suggestions on outside click", () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "a" } });
    fireEvent.mouseDown(document);
    expect(screen.queryByText("apple")).not.toBeInTheDocument();
  });

  // it("displays suggestions when typing", () => {
  //   setup();
  //   const input = screen.getByRole("textbox");
  //   fireEvent.change(input, { target: { value: "a" } });
  //   expect(screen.getByText("apple")).toBeInTheDocument();
  //   expect(screen.getByText("banana")).toBeInTheDocument();
  //   expect(screen.getByText("grape")).toBeInTheDocument();
  // });

  // it("handles keyboard navigation", () => {
  //   setup();
  //   const input = screen.getByRole("textbox");
  //   fireEvent.change(input, { target: { value: "a" } });
  //   fireEvent.keyDown(document, { key: "ArrowDown" });
  //   fireEvent.keyDown(document, { key: "Enter" });
  //   expect(mockSetValue).toHaveBeenCalledWith("apple");
  // });
});
