import "./App.css";
import AutoComplete from "./components/AutoComplete";
import { useState, ChangeEvent } from "react";
import options from "./components/Suggestions";
import * as Icon from "@livingdesign/icons-indigo";
import { LinkButton } from "@livingdesign/react";

export default function App() {
  const [value, setValue] = useState<string>("");
  const autoComplete: string[] = value === "" ? [] : options.filter((option) => option.toLowerCase().startsWith(value.toLowerCase())).slice(0, 10);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleClick = (): void => {
    setValue("");
  };

  return (
    <>
      <AutoComplete
        value={value}
        handleChange={handleChange}
        handleClick={handleClick}
        setValue={setValue}
        label="Auto-Complete Suggestions"
        autoComplete={autoComplete}
        icon={<Icon.Pencil size="small" />}
        button= {<LinkButton trailing={<Icon.Eye/>}>
                  click
                </LinkButton>
        }
      />
    </>
  );
}
