"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./Chart";
import SpendInput from "./SpendInput";

const Projection = props => {
  const [data, setData] = useState([]);
  const [aveSpend, setAveSpend] = useState(23);
  useEffect(() => {
    axios.get("/API/projection", {
      params: {
        minimum: 1,
        maximum: 1,
        custom: aveSpend,
        offset: -96.5,
        from: "2023-09-27",
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
  }, [aveSpend]);

  return (
    <div>
      <SpendInput
        defaultValue={aveSpend}
        setValue={v => setAveSpend(v)}
      />
      <Chart data={data} />
    </div>
  )
};

export default Projection;