import React, { useState, useEffect } from "react";
import axios from "axios";

const YesterdayBudget = props => {
  const [budget, setBudget] = useState(0);
  const [spend, setSpend] = useState(0);
  useEffect(() => {
    // axios.get("/API/history")
    //   .then(res => console.log(res));
  }, []);

  return (
    <div className="yesterday-budget">
      <div className="yesterday-budget-item">
        <div className="describer">
          Budget
        </div>
        <div className="value">
          $ {budget.toFixed(2)}
        </div>
      </div>
      <div className="yesterday-budget-item">
        <div className="describer">
          Spend
        </div>
        <div className="value">
          $ {spend.toFixed(2)}
        </div>
      </div>
    </div>
  )
};

export default YesterdayBudget;