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
        offset: 309.60,
        to: "2023-12-31"
      }
    })
      .then(res => {
        const { minimum, maximum, custom } = res.data;
        const consolidatedData = [];
        for (var i = 0; i < minimum.length; i++) {
          consolidatedData.push({
            date: minimum[i].date,
            minimumSpend: minimum[i].value,
            maximumSpend: maximum[i].value,
            customSpend: custom[i].value
          });
        }
        setData(consolidatedData);
      });
  }, []);

  return (
    <div>
      <LineChart
        width={730}
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
        <Line type="monotone" dataKey="customSpend" stroke="#42ecf5" />
        <Line type="monotone" dataKey="maximumSpend" stroke="#82ca9d" />
        <Line type="monotone" dataKey="minimumSpend" stroke="#8884d8" />
      </LineChart>
    </div>
  )
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active) {
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
      <div style={{ color: payload[0].stroke }}>
        ${parseFloat(payload[0].value).toFixed(2)}
      </div>
      <div style={{ color: payload[1].stroke }}>
        ${parseFloat(payload[1].value).toFixed(2)}
      </div>
      <div style={{ color: payload[2].stroke }}>
        ${parseFloat(payload[2].value).toFixed(2)}
      </div>
    </div>
  );
}

export default Projection;