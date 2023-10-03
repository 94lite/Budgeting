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
      const today = new Date();
      const paidItems = [];
      const [dividedAmount, amountInBuffer] = res.data.reduce((acc, cur) => {
        const {
          expenditure,
          dividedAmount, amountInBuffer,
          previousPayDates, futurePayDates,
          nextPayDate
        } = cur;
        acc[0] = acc[0] + dividedAmount;
        if (today < new Date(nextPayDate)) {
          acc[1] = acc[1] + amountInBuffer;
        } else {
          paidItems.push(expenditure);
          const allPayDates = previousPayDates.concat(futurePayDates);
          let paidCount = 0;
          let totalCount = 0;
          allPayDates.forEach(payDate => {
            if (today >= new Date(payDate)) {
              paidCount++;
            }
            totalCount++;
          });
          const fraction = paidCount/totalCount;
          acc[1] = acc[1] + (1 - fraction) * amountInBuffer;
        }
        return acc
      }, [0, 0]);
      console.log(dividedAmount, paidItems);
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