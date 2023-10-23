import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AccountValuesContext } from "./Accounts";

const parsePayments = paidExpenditures => {
  return paidExpenditures.reduce((acc, cur) => {
    const { expenditure } = cur
    if (expenditure in acc) {
      acc[expenditure].push(cur);
    } else {
      acc[expenditure] = [cur];
    }
    return acc;
  }, {});
}

const parseExpenditures = (expenditures, paidExpenditures) => {
  const parsed = expenditures.reduce((acc, cur) => {
    const {
      expenditure,
      amount, amountInBuffer,
      nextPayDate,
      previousPayDates, futurePayDates,
      previousTopUpDates, futureTopUpDates
    } = cur;
    const parsedItem = {
      nextPayDate,
      amountInBuffer,
      amount
    };
    if (expenditure in paidExpenditures) {
      paidExpenditures[expenditure].forEach(paid => {
        const { amount: amountPaid } = paid;
      });
    }
    acc[expenditure] = parsedItem;
    return acc
  }, {});
  return parsed
};

const getAPIs = (lastIncomeDate, frequency) => {
  return [
    axios.get(
      "/API/income/divide",
      {
        params: {
          date: lastIncomeDate,
          frequency
        }
      }
    ),
    axios.get(
      "/API/expenditures/paid",
      {
        params: {
          from: lastIncomeDate
        }
      }
    )
  ];
}

const ExpensesAccount = props => {
  const { lastIncomeDate } = props;

  const context = useContext(AccountValuesContext);
  const { updateAmount } = context;
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    axios.all(getAPIs(lastIncomeDate, "fortnightly")).then(res => {
      const [divideResponse, paidResponse] = res;
      const payments = parsePayments(paidResponse.data);
      const xyz = parseExpenditures(divideResponse.data, payments);
      console.log(xyz);
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