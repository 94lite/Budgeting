"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

import Chart from "./Chart";
import SpendInput from "./SpendInput";
import BasicDatePicker from "./DatePicker";

import { getTodayDate, getEndOfYear, getDifference } from "@/utility/dates";

const Projection = props => {
  const [data, setData] = useState([]);
  const [aveSpend, setAveSpend] = useState(23);
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getEndOfYear());
  const [latest, setLatest] = useState();
  useEffect(() => {
    if (
      latest
      && (latest[0] === aveSpend)
      && (new Date(toDate) < new Date(latest[1]))
    ) {
      return;
    }
    axios.get("/API/projection", {
      params: {
        minimum: 1,
        maximum: 1,
        custom: aveSpend,
        offset: 45.5 + 477.49,
        from: getTodayDate(),
        to: toDate
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
        setLatest([aveSpend, toDate])
      });
  }, [aveSpend, toDate]);

  const today = getTodayDate();
  const fromDiff = getDifference(today, fromDate);
  const endDiff = getDifference(today, toDate);

  return (
    <div className="projection">
      <Chart
        data={endDiff > fromDiff
          ? data.slice(
            fromDiff < 0 ? 0 : fromDiff,
            endDiff + 1
          )
          : data
        }
      />
      <div>
        <SpendInput
          defaultValue={aveSpend}
          setValue={v => setAveSpend(v)}
        />
        <BasicDatePicker
          label="From Date"
          defaultDate={fromDate}
          setDate={d => setFromDate(d)}
        />
        <BasicDatePicker
          label="To Date"
          defaultDate={toDate}
          setDate={d => setToDate(d)}
        />
      </div>
    </div>
  )
};

export default Projection;