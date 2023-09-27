import React, { useState, useEffect } from "react";
import axios from "axios";

const ExpensesAccount = props => {
  const { lastIncomeDate } = props;
  useEffect(() => {
    axios.get(
      "/API/income/divide",
      {
        params: {
          date: lastIncomeDate,
          frequency: "fortnightly"
        }
      }
    ).then(res => {
      console.log(res.data.reduce((acc, cur) => [
        acc[0] + cur["dividedAmount"],
        acc[1] + cur["amountInBuffer"]
      ], [0, 0]));
    });
  }, []);

  return (
    <div>hello world</div>
  )
}

export default ExpensesAccount;