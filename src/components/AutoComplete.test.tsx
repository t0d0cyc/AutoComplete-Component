import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; 
import AutoComplete from "./AutoComplete";

describe("AutoComplete Component", () => {
  const mockSetValue = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleClick = jest.fn();
  const autoCompleteData = [
    "What are you doing",
    "Can you show me on the map",
    "I am hungry",
    "Where can I find a good restaurant",
  ];

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

  //test 1
  it("renders without crashing", () => {
    setup();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  //test2
  it("hides suggestions on outside click", async () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "w" } });
    fireEvent.click(document);
    await waitFor(() =>
      expect(
        screen.queryByText("Where can I find a good restaurant")
      ).not.toBeInTheDocument()
    );
  });

  //test3
  it("does not show suggestions if input value does not match any suggestion", async () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "xyz" } });
    await waitFor(() =>
      expect(screen.queryByText("What are you doing")).not.toBeInTheDocument()
    );
  });

  //test4
  it("displays suggestions when typing", async () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "w" } });

    await waitFor(() =>
      expect(screen.getByText((content) => content.startsWith("What are you doing"))
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText((content) => content.startsWith("Where can I find a good restaurant"))
      ).toBeInTheDocument()
    );

    await waitFor(() =>
      expect(screen.getByText((content) => content.startsWith("Where is the nearest coffee shop"))
      ).toBeInTheDocument()
    );

  });

  //test5
  it("highlights matched text", async () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "wh" } });

    await waitFor(() =>
      expect(
        screen.getByText("Where can I find a good restaurant")
      ).toBeInTheDocument()
    );

    const highlightedText = screen.getByText("Where can I find a good restaurant").querySelector(".highlight");
    expect(highlightedText).toHaveTextContent("wh");



  });

  //test6
  it("calls setValue when a suggestion is clicked", async () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "w" } });

    await waitFor(() =>
      screen.getByText("Where can I find a good restaurant")
    );

    fireEvent.click(screen.getByText("Where can I find a good restaurant"));
    expect(mockSetValue).toHaveBeenCalledWith("Where can I find a good restaurant");
  });

  //test7
  it("handles keyboard navigation", async () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "w" } });

    await waitFor(() =>
      expect(screen.getByText("Where can I find a good restaurant")).toBeInTheDocument()
    );
    fireEvent.keyDown(input, { key: "ArrowDown" });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(mockSetValue).toHaveBeenCalledWith("Where can I find a good restaurant");
  });

  //test8
  it("calls handleClick when the close icon is clicked", () => {
    setup();
    const input = screen.getByRole("textbox");
    const closeIcon = screen.getByRole("button"); // Assuming the close icon is inside a button element
    fireEvent.click(closeIcon);
    expect(mockHandleClick).toHaveBeenCalled();
  });

  //test9
  it("clears input when handleClick is invoked", () => {
    setup();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "w" } });
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetValue).toHaveBeenCalledWith("");
  });
});
