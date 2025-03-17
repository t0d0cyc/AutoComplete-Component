import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Icon from "@livingdesign/icons-indigo";
import { TextField, List, ListItem } from "@livingdesign/react";

interface AutoCompleteProps {
  value: string;
  setValue: (value: string) => void;
  autoComplete: string[];
  label?: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  inputFieldStyle?: React.CSSProperties;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  value,
  setValue,
  autoComplete,
  label,
  handleChange,
  handleClick,
  leading,
  trailing,
  inputFieldStyle
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const autoCompleteRef = useRef<HTMLDivElement>(null);
  const inputValueRef = useRef(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  // Handles when a suggestion is clicked
  const handleValueChange = useCallback((suggestion: string) => {
    setShowSuggestions(false);
    setValue(suggestion);
  }, [setValue]);


  // Handles when there is a change in the textfield
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    setSelectedItem(-1);
    setShowSuggestions(true); // Show suggestions when typing
  };


  // Handles the highlighted text functionality
  const highlightMatchedText = useCallback((suggestion: string, input: string) => {
    const startIdx = suggestion.toLowerCase().indexOf(input.toLowerCase());
    if (startIdx === 0) {
      const endIdx = input.length;
      const matchedText = suggestion.slice(0, endIdx);
      const remainingText = suggestion.slice(endIdx);

      return (
        <div>
          <span className="highlight">{matchedText}</span>
          {remainingText}
        </div>
      );
    }
    return suggestion;
  }, []);


  // For handling click outside component (suggestions should go away)
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (autoCompleteRef.current && !autoCompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);


  // For adding debounce functionality, clearing unnecessary timeouts
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (inputValueRef.current !== value) {
        inputValueRef.current = value;
        setSuggestions(autoComplete);
      }
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, autoComplete]);


  // For handling keyboard navigation through the list
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const len = suggestions.length;
      if (len <= 0) {
        return;
      }
      if (event.key === "ArrowUp" && selectedItem >= 0) {
        setSelectedItem((selectedItem - 1 + len) % len);
      } else if (event.key === "ArrowDown") {
        setSelectedItem((selectedItem + 1) % len);
      } else if (event.key === "Enter" && selectedItem >= 0) {
        handleValueChange(suggestions[selectedItem]);
        setSelectedItem(-1);
      } else if (event.key === "Escape") {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [selectedItem, suggestions, handleValueChange]);

  return (
    <>
      <div className="text-bar" ref={autoCompleteRef}>
        <TextField
          textFieldProps={{
            style: inputFieldStyle || {
              width: '200px',
              paddingRight: '30px'
            }
          }}
          label={label || ''}
          onChange={handleOnChange}
          value={value}
        />
        <Icon.CloseCircleFill
          className="icon-inside-input"
          onClick={handleClick}
        />
      </div>

      <div className="suggestion-list" ref={autoCompleteRef}>
        {showSuggestions && suggestions.map((suggestion, index) => (
          <List
            UNSAFE_className={index === selectedItem ? "highlighted-background" : "width"}
            onClick={() => { handleValueChange(suggestion); }}
            key={suggestion}
          >
            <ListItem
              trailing={trailing}
              UNSAFE_className="list-item"
              key={index}
            >
              <div className="list">
                <div className="list-icon">
                  {leading}
                </div>
                {highlightMatchedText(suggestion, value)}
              </div>
            </ListItem>
          </List>
        ))}
      </div>
    </>
  );
};

export default AutoComplete;
