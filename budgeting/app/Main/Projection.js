"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

const Projection = props => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get("/API/projection", {
      params: {
        minimum: 1,
        maximum: 1,
        custom: 25.5,
        offset: 266.9,
        to: "2024-01-02"
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
  }, []);

  return (
    <LineChart
      width={640}
      height={250}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        hide={true}
        dataKey="date"
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
        isAnimationActive={false}
      />
      <Line
        type="linear"
        dataKey="full spend"
        stroke="#82ca9d"
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
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