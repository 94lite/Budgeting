import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

const REGEX_TEST = new RegExp(/^\d*\.?\d*$/);

const SpendInput = props => {
  const { defaultValue, setValue } = props;
  const [input, setInput] = useState(parseFloat(defaultValue || 0).toFixed(2));

  const validateInputKey = e => {
    // For input component
    // Prevent input keys that are letter or special characters (exception: ".")
    const { key, target } = e;
    if (key === "Backspace" || key.startsWith("Arrow")) {
      return;
    } else if (key === "Enter") {
      const f = parseFloat(target.value).toFixed(2);
      if (!(isNaN(f))) {
        setInput(f);
        if (f !== defaultValue) {
          setValue(f);
        }
      } else {
        setInput("0.00");
        setValue(0);
      }
    } else if (!REGEX_TEST.test(key)) {
      e.preventDefault();
    } else if (key === "." && target.value.includes(".")) {
      e.preventDefault();
    }
  }

  const onChange = v => {
    // For input component
    // Prevent value change if
    //  - updated value is less than zero
    //  - greater than maximum
    setInput(v);
  }
  
  return (
    <TextField
      variant="outlined"
      label="Estimate Spending"
      size="small"
      value={input}
      onKeyDown={e => validateInputKey(e)}
      onChange={e => onChange(e.target.value)}
      onBlur={e => {
        e.key = "Enter";
        validateInputKey(e);
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            disableTypography={true}
            sx={{ color: "white" }}
            children={"$"}
          />
        ),
        sx: {
          color: "white",
          font: "unset"
        }
      }}
      inputProps={{ style: { textAlign: "right" } }}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "white" },
          "&:hover fieldset": { borderColor: "white" },
          "&.Mui-focused fieldset": { borderColor: "white" }
        },
        "& .MuiInputLabel-root": {
          color: "white",
          font: "unset",
          "&.Mui-focused": { color: "white" }
        }
      }}
    />
  )
}

export default SpendInput;