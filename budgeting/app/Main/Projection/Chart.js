import React, { memo } from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";

const Chart = props => {
  const { data } = props;

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
}

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

const MemoChart = memo(Chart, (prev, next) => {
  return prev.data === next.data;
});

export default MemoChart;