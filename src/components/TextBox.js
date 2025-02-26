import { useState, useEffect, useRef, useCallback } from "react";
import * as Icon from "@livingdesign/icons-indigo";
import { LineClamp, TextField } from "@livingdesign/react";

export default function TextBox(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);   
  const autoCompleteRef = useRef(null);
  const inputValueRef = useRef(props.value);
  const timeoutRef = useRef();


  //for handling click outside component (suggestions should go away)
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);
  

  //for adding the debounce functionality, also clearing the unnecessary timeouts using useRef Hook
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (inputValueRef.current !== props.value) {
        inputValueRef.current = props.value;
        setSuggestions(props.autoComplete);
        //setShowSuggestions(true);
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [props.value]);


  //for handling keyboard navigation through the list
  useEffect(() => {
    const  handleKeyDown = (event) => {
        console.log("clicked key: ",event.key);
        const len = suggestions.length;
        if(len > 0){
            if(event.key === "ArrowUp" && selectedItem >= 0){
                setSelectedItem((selectedItem -1 + len) % len);
            }
            else if(event.key === "ArrowDown"){
                setSelectedItem((selectedItem+1) % len);
            }
            else if(event.key === "Enter" && selectedItem >= 0){
                handleValueChange(suggestions[selectedItem]);
                setSelectedItem(-1);
            }
            else if(event.key === "Escape"){
                setShowSuggestions(false);
            }
        }
    }
    document.addEventListener('keydown',handleKeyDown,true);
  
    return () => {
      document.removeEventListener('keydown',handleKeyDown,true);
    }
  }, [selectedItem,suggestions])

  
  // Handles when a suggestion is clicked 
  const handleValueChange = useCallback((suggestion) => {
    setShowSuggestions(false);
    props.setValue(suggestion);
  }, [props]);


  // Handles when there is a change in the textfield
  const handleOnChange = (event) => {
    props.handleChange(event);
    setSelectedItem(-1);
    setShowSuggestions(true); // Show suggestions when typing
  };
  

  //handles the highlighted text functionality
  const highlightMatchedText = (suggestion, input) => {
    const startIdx = suggestion.toLowerCase().indexOf(input.toLowerCase());
    if (startIdx === 0) {
      const endIdx = input.length;
      const matchedText = suggestion.slice(0, endIdx);
      const remainingText = suggestion.slice(endIdx);

      return (
        <>
          <span className="highlight">{matchedText}</span>
          {remainingText}
        </>
      );
    }
    return suggestion;
  };

  return (
    <>
      <div className = "text-bar" ref={autoCompleteRef}>
        <TextField
          label={props.label}
          trailing={<Icon.CloseCircleFill onClick={props.handleClick} style={{ cursor: "pointer" }}/>}
          onChange={handleOnChange}
          value={props.value}
        />
      </div>
      <div className="suggestion-list" ref={autoCompleteRef}>
        {showSuggestions && (
          <ul className="suggestion">
            {suggestions.map((suggestion,index) => (
            <li className = {index === selectedItem ? "highlighted-background" : ""} onClick={() => {handleValueChange(suggestion);}} key={suggestion}>
                {highlightMatchedText(suggestion, props.value)}
            </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
