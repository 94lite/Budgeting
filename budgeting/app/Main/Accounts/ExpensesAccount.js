import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AccountValuesContext } from "./Accounts";

const ExpensesAccount = props => {
  const { lastIncomeDate } = props;

  const context = useContext(AccountValuesContext);
  const { updateAmount } = context;
  const [amount, setAmount] = useState(0);
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
      const [dividedAmount, amountInBuffer] = res.data.reduce((acc, cur) => [
        acc[0] + cur["dividedAmount"],
        acc[1] + cur["amountInBuffer"]
      ], [0, 0]);
      setAmount(amountInBuffer);
      updateAmount
        ? updateAmount("expenses", amountInBuffer)
        : null;
    });
  }, []);

  // for each expenditure,
  //  - calculate last payment date
  //  - calculate next due date
  // extract all payments that were made
  // for each expenditure post last payment date

  return (
    <div>{amount.toFixed(2)}</div>
  )
}

export default ExpensesAccount;