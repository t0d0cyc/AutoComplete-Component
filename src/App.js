import "./App.css"
import TextBox from "./components/TextBox";
import { useState } from "react";

export default function App() {
    const [value, setValue] = useState("");
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleClick = () => {
        setValue("");
    }
    const valueChange = (text) => {
        setValue(text);
    }
  return (
    <>
        <TextBox value = {value} handleChange = {handleChange} handleClick = {handleClick} 
        valueChange = {valueChange} label = "Auto-Complete Suggestions"
        numberOfSuggestions = {10}/>
    </>
  )
}