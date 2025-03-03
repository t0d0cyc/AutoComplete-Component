import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import * as Icon from "@livingdesign/icons-indigo";
import { TextField, List, ListItem } from "@livingdesign/react";

// Define the prop types
interface TextBoxProps {
  value: string;
  label: string;
  autoComplete: string[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValue: (value: string) => void;
  handleClick: () => void;
  button?: React.ReactNode;
  icon?: React.ReactNode;
}

export default function TextBox(props: TextBoxProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<number>(-1);
  const autoCompleteRef = useRef<HTMLDivElement | null>(null);
  const inputValueRef = useRef<string>(props.value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


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
      if (inputValueRef.current !== props.value) {
        inputValueRef.current = props.value;
        setSuggestions(props.autoComplete);
      }
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [props.value]);


  // For handling keyboard navigation through the list
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const len = suggestions.length;
      if (len > 0) {
        if (event.key === "ArrowUp" && selectedItem >= 0) {
          setSelectedItem((selectedItem - 1 + len) % len);
        } 
        else if (event.key === "ArrowDown") {
          setSelectedItem((selectedItem + 1) % len);
        } 
        else if (event.key === "Enter" && selectedItem >= 0) {
          handleValueChange(suggestions[selectedItem]);
          setSelectedItem(-1);
        } 
        else if (event.key === "Escape") {
          setShowSuggestions(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [selectedItem, suggestions]);


  // Handles when a suggestion is clicked
  const handleValueChange = useCallback((suggestion: string) => {
    setShowSuggestions(false);
    props.setValue(suggestion);
  }, [props]);


  // Handles when there is a change in the textfield
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.handleChange(event);
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
        <>
          <span className="highlight">{matchedText}</span>
          {remainingText}
        </>
      );
    }
    return suggestion;
  }, []);

  return (
    <>
      <div className="text-bar" ref={autoCompleteRef}>
        <TextField
          label={props.label}
          trailing={<Icon.CloseCircleFill onClick={props.handleClick} style={{ cursor: "pointer" }} />}
          onChange={handleOnChange}
          value={props.value}
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
              trailing={props.button}
              UNSAFE_style={{display: "flex", alignItems: "center", width: "100%",justifyContent: "space-between"}}
            >
              <div style={{ display: "flex", alignItems: "center", flexGrow: 1, marginRight: '8px' }}>
                <div style={{ marginRight: '4px' }}>
                  {props.icon}
                </div>
                <div>
                  {highlightMatchedText(suggestion, props.value)}
                </div>
              </div>
            </ListItem>
          </List>
        ))}
      </div>
    </>
  );
}
