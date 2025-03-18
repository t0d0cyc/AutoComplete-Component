import "./App.css";
import React, { useState, ChangeEvent } from "react";
import AutoComplete from "./components/AutoComplete";
import options from "./components/Suggestions";
import * as Icon from "@livingdesign/icons-indigo";

const App = () => {
const [value, setValue] = useState<string>("");

const autoComplete = value === "" ? [] : options
  .filter((option) => option.toLowerCase().startsWith(value.toLowerCase()))
  .slice(0, 10);

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

const handleClick = () => {
  setValue("");
};

return (
    <AutoComplete
      value={value}
      setValue={setValue}
      autoComplete={autoComplete}
      label="Auto-Complete Suggestions"
      handleChange={handleChange}
      handleClick={handleClick}
      leading = {<Icon.Search size="small"/>}
      trailing={
          <Icon.ChevronRight size="small"/>
      }
      inputFieldStyle={{
        width: "100%",
        paddingRight: "30px",
      }}
    />
);
};

export default App;
