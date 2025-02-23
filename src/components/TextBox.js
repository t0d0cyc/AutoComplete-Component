import { Button, TextField } from "@livingdesign/react";
import options from "an-array-of-english-words";
import { useState,useEffect,useRef } from "react";

export default function TextBox(props) {
  const temp = props.value.split(/(\s+)/);
  const word = temp[temp.length - 1];
  const suggestions = word === "" ? [] : (options.filter((option) => 
    option.toLowerCase().startsWith(word.toLowerCase())).slice(0,props.numberOfSuggestions));
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

  const handleOnChange = (event) => {
    props.handleChange(event);
    setShowSuggestions(true);
  }
  
  return (
    <>
      <div style = {{fontSize : "10px"}} ref = {autoCompleteRef}>
          <TextField
          label= {props.label}
          onChange = {handleOnChange}
          trailing={<Button onClick = {props.handleClick}>Delete</Button>}
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
                    )
                    )}
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
