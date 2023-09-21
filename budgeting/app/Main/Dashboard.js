"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

import YesterdayBudget from "./YesterdaysBudget";
import BudgetSubmitter from "./BudgetSubmitter";

import Projection from "./Projection";

const Dashboard = props => {
  const [budget, setBudget] = useState(0);
  useEffect(() => {
    axios.get("/API/calculate")
      .then(res => {
        console.log(res.data);
        const {
          daily: {
            incomes,
            expenditures,
            difference
          }
        } = res.data;
        setBudget(difference);
      });
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-left-panel">
        <div className="budget">
          <div className="budget-items">
            <CurrentBudget budget={budget} />
            <div className="yesterday-title">
              Yesterday's
            </div>
            <YesterdayBudget />
          </div>
          <BudgetSubmitter budget={budget} />
        </div>
        <div className="pay-budget">
          <BudgetUntilNextPay />
          <SavingsSoFar />
          <BudgetResetter />
        </div>
      </div>
      <hr />
      <div className="dashboard-right-panel">
        <div>
          <Projection />
        </div>
      </div>
    </div>
  )
};

const CurrentBudget = props => {
  const { budget } = props;

  return (
    <div className="current-budget">
      <div className="describer">
        Today's Budget
      </div>
      <div className="value">
        ${budget.toFixed(2)}
      </div>
    </div>
  )
};

const BudgetUntilNextPay = props => {
  const budget = 637.00;

  return (
    <div className="budget-until-next-pay">
      <div className="describer">
        Budget until next pay
      </div>
      <div className="value">
        ${budget.toFixed(2)}
      </div>
    </div>
  )
};

const BudgetResetter = props => {
  const onClick = () => {
    console.log("hello world");
  }

  return (
    <Button
      variant="contained"
      onClick={onClick}
    >
      Reset
    </Button>
  )
};

const SavingsSoFar = props => {
  const savings = 567.00;
  const date = "15-07";

  return (
    <div className="savings-so-far">
      <div className="describer">
        Savings so far
      </div>
      <div className="value">
        ${savings.toFixed(2)}
      </div>
      <div className="caption">
        Since {date}
      </div>
    </div>
  )
};

const LastPaysSavings = props => {};

export default Dashboard;