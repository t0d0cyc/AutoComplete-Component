import "./App.css"
import AutoComplete from "./components/AutoComplete";
import {useState} from "react";
import {words} from "popular-english-words";

export default function App() {
    const [value, setValue] = useState("");
    const options = words.getAll();
    const autoComplete = value === "" ? [] : (options.filter((option) => 
      option.toLowerCase().startsWith(value.toLowerCase())).slice(0,10))
    const handleChange = (event) => {
        setValue(event.target.value);
    }
    const handleClick = () => {
        setValue("");
    }
  return (
    <>
        <AutoComplete value = {value} handleChange = {handleChange} handleClick = {handleClick} 
        setValue = {setValue} label = "Auto-Complete Suggestions" autoComplete = {autoComplete}/>
    </>
  )
}
