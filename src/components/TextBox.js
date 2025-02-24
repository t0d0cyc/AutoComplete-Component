import { useState, useEffect, useRef } from "react";
import * as Icon from '@livingdesign/icons-indigo';
import { Button, TextField } from "@livingdesign/react";
import options from "an-array-of-english-words";

export default function TextBox(props) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autoCompleteRef = useRef(null);

  const handleValueChange = (suggestion) => {
    const temp = props.value.split(/\s+/);
    temp.pop();
    temp.push(suggestion);
    setShowSuggestions(false);
    props.valueChange(temp.join(" "));
  }

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if(autoCompleteRef.current && !autoCompleteRef.current.contains(event.target)){
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click',handleOutsideClick);
    return () => {
      document.removeEventListener('click',handleOutsideClick);
    }
  }, [])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        const temp = props.value.split(/(\s+)/);
        const word = temp[temp.length - 1];
        setSuggestions(word === "" ? [] : (options.filter((option) => 
          option.toLowerCase().startsWith(word.toLowerCase())).slice(0,props.numberOfSuggestions)));
    }, 400) // 400ms delay after typing
  
    return () => clearTimeout(delayDebounceFn)
  }, [props.value])

  const handleOnChange = (event) => {
    props.handleChange(event);
    setShowSuggestions(true);
  }

  return (
    <>
      <div style = {{fontSize : "10px"}} ref = {autoCompleteRef}>
          <TextField
          label= {props.label}
          trailing={<Icon.CloseCircleFill onClick = {props.handleClick} style = {{cursor: "pointer"}}/>}
          onChange = {handleOnChange}
          value = {props.value}
          />
      </div>
        <div className="left" ref = {autoCompleteRef}>
            {showSuggestions && (
                <ul className="suggestions">
                    {suggestions.map(suggestion => (
                        <li onClick={() => {handleValueChange(suggestion)}} key={suggestion}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </>
  )
}

TextBox.defaultProps = {
  label: "Word Suggestion",
  numberOfSuggestions: 15,
  value: ""
}
