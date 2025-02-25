import { useState, useEffect, useRef } from "react";
import * as Icon from "@livingdesign/icons-indigo";
import { TextField } from "@livingdesign/react";

export default function TextBox(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
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
  

  //for adding the debounce functionality, also clearing the unnecessary timeouts
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (inputValueRef.current !== props.value) {
        inputValueRef.current = props.value;
        const options = props.words.getAll();
        setSuggestions(props.value === "" ? [] : (options.filter((option) => 
            option.toLowerCase().startsWith(props.value.toLowerCase())).slice(0,props.numberOfSuggestions)));
      }
    }, 400); // 400ms delay after typing

    return () => clearTimeout(timeoutRef.current);
  }, [props.value]);

  
  //handles when a suggestion is clicked 
  const handleValueChange = (suggestion) => {
    setShowSuggestions(false);
    props.setValue(suggestion);
  };
  

  //handles when there is a change in the textfield
  const handleOnChange = (event) => {
    props.handleChange(event);
    setShowSuggestions(true);
  };

  return (
    <>
      <div style={{ fontSize: "10px" }} ref={autoCompleteRef}>
        <TextField
          label={props.label}
          trailing={<Icon.CloseCircleFill onClick={props.handleClick} style={{ cursor: "pointer" }}/>}
          onChange={handleOnChange}
          value={props.value}
        />
      </div>
      <div className="left" ref={autoCompleteRef}>
        {showSuggestions && (
          <ul className="suggestions">
            {suggestions.map((suggestion) => (
              <li onClick={() => {handleValueChange(suggestion);}} key={suggestion}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
