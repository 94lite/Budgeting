import React, { useState, useContext, useEffect } from "react";

import { AccountValuesContext } from "./Accounts";

const SavingsAccount = props => {
  const context = useContext(AccountValuesContext);
  const { deriveAmount } = context;
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    setAmount(deriveAmount());
  });

  return (
    <div>{amount.toFixed(2)}</div>
  )
}

export default SavingsAccount;