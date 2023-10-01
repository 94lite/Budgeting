import React, { useState, useEffect, useContext } from "react";

import { AccountValuesContext } from "./Accounts";

import { getTodayDate, getDifference } from "@/utility/dates";

const BudgetBufferAccount = props => {
  const { assignedBudget, nextIncomeDate } = props;
  const context = useContext(AccountValuesContext);
  const { updateAmount } = context;
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    const daysLeft = getDifference(getTodayDate(), nextIncomeDate);
    const v = (assignedBudget || 0) * (daysLeft - 1);
    updateAmount("budget-buffer", v);
    setAmount(v);
  })

  return (
    <div>{amount.toFixed(2)}</div>
  )
};

export default BudgetBufferAccount;