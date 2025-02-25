import "./App.css"
import TextBox from "./components/TextBox";
import { useState } from "react";
import {words} from "popular-english-words";

export default function App() {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleClick = () => {
        setValue("");
    }
  return (
    <>
        <TextBox value = {value} handleChange = {handleChange} handleClick = {handleClick} 
        setValue = {setValue} label = "Auto-Complete Suggestions"
        numberOfSuggestions = {10} words = {words}/>
    </>
  )
}
