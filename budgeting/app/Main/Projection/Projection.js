"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

const REGEX_TEST = new RegExp(/^\d*\.?\d*$/);

const Projection = props => {
  const [data, setData] = useState([]);
  const [custom, setCustom] = useState(23);
  const [input, setInput] = useState(parseFloat(custom).toFixed(2));
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    axios.get("/API/projection", {
      params: {
        minimum: 1,
        maximum: 1,
        custom,
        offset: 138.4,
        from: "2023-09-26",
        to: "2023-12-31"
      }
    })
      .then(res => {
        const { minimum, maximum, custom } = res.data;
        const consolidatedData = [];
        for (var i = 0; i < minimum.length; i++) {
          consolidatedData.push({
            date: minimum[i].date,
            "no spend": minimum[i].value,
            "full spend": maximum[i].value,
            "custom": custom[i].value
          });
        }
        setData(consolidatedData);
      });
  }, [custom]);
  useEffect(() => {
    setRevision(revision + 1);
  }, [data]);

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
        if (f !== custom) {
          setCustom(f);
        }
      } else {
        setInput("0.00");
        setCustom(0);
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
    <div>
      <div style={{ textAlign: "right" }}>
        <TextField
          variant="outlined"
          label="Estimate Spending"
          size="small"
          defaultValue={custom}
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
      </div>
      <LineChart
        key={revision}
        width={640}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          hide={true}
          dataKey="date"
          interval={13}
        />
        <YAxis />
        <Tooltip
          content={<CustomTooltip />}
        />
        <Legend />
        <Line
          type="linear"
          dataKey="no spend"
          stroke="#8884d8"
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="linear"
          dataKey="custom"
          stroke="#42ecf5"
          dot={false}
          animationDuration={250}
          // isAnimationActive={false}
        />
        <Line
          type="linear"
          dataKey="full spend"
          stroke="#82ca9d"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  )
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) {
    return null;
  }
  return (
    <div
      style={{
        padding: "4px",
        background: "rgba(0, 0, 0, 0.8)",
        border: "1px solid white",
        fontSize: "small",
        textAlign: "right"
      }}
    >
      <div>
        {label}
      </div>
      {payload.map(item => {
        const { name, value, stroke } = item;
        return (
          <div key={name} style={{ color: stroke }}>
            {name} ${parseFloat(value).toFixed(2)}
          </div>
        )}
      )}
    </div>
  );
}

export default Projection;