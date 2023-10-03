import React, { useState, useRef, createContext, useContext } from "react";
import ExpensesAccount from "./ExpensesAccount";
import SavingsAccount from "./SavingsAccount";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import BudgetBufferAccount from "./BudgetBufferAccount";

export const AccountValuesContext = createContext({
  updateAmount: () => null,
  deriveAmount: () => null
});

const BUDGET = 45.5;

const Accounts = props => {
  return (
    <div className="accounts">
      <Account title="Cheque">
        <SubAccount title="Day Budget" value={BUDGET} />
        <SubAccount title="Free Spending" />
      </Account>
      <Account title="Savings" actualValue={397.27}>
        <SubAccount title="Budget Buffer">
          <BudgetBufferAccount
            assignedBudget={BUDGET}
            nextIncomeDate="2023-10-12"
          />
        </SubAccount>
        <SubAccount title="Collection" />
        <SubAccount title="Expenses Buffer">
          <ExpensesAccount
            lastIncomeDate="2023-09-28"
          />
        </SubAccount>
        <SubAccount title="Savings">
          <SavingsAccount />
        </SubAccount>
      </Account>
      <Account title="Credit">
        <SubAccount title="Credit" value={7000 - 6817.20} />
      </Account>
    </div>
  )
};

const Account = props => {
  const { title, children, actualValue } = props;

  const [value, setValue] = useState(0);
  const balances = useRef({});

  const updateAmount = (key, v) => {
    balances.current[key] = v;
    const amount = Object.entries(balances.current).reduce((acc, [k, cur]) => {
      return acc + cur;
    }, 0);
    setValue(amount);
  };
  const deriveAmount = () => {
    const x = actualValue - value;
    return x;
  };

  return (
    <div className="account savings-account">
      <div>{title}</div>
      <div className="account-content">
        <div className="panel left-panel">
          <AccountValuesContext.Provider value={{ updateAmount, deriveAmount }}>
            {children}
          </AccountValuesContext.Provider>
        </div>
        <div className="panel right-panel">
          {actualValue !== undefined
            ? actualValue.toFixed(2)
            : value.toFixed(2)
          }
        </div>
      </div>
    </div>
  )
};

const SubAccount = props => {
  const { title, children } = props;

  const context = useContext(AccountValuesContext);
  const {
    updateAmount: updateParentAmount,
    deriveAmount: deriveAmountFromParent
  } = context;
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const balances = useRef({});

  const updateAmount = (key, v) => {
    balances.current[key] = v;
    const amount = Object.entries(balances.current).reduce((acc, [k, cur]) => {
      return acc + cur;
    }, 0);
    setValue(amount);
    updateParentAmount(title, amount);
  };
  const deriveAmount = () => {
    const derived = deriveAmountFromParent();
    setValue(derived);
    return derived;
  };

  return (
    <div className="sub-account">
      <div className="sub-account-summary" onClick={() => setOpen(true)}>
        <div className="key">{title}</div>
        <div className="value">$ {value.toFixed(2)}</div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        keepMounted={true}
      >
        <Box sx={modalStyle}>
          <AccountValuesContext.Provider value={{ updateAmount, deriveAmount }}>
            {children}
          </AccountValuesContext.Provider>
        </Box>
      </Modal>
    </div>
  )
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: 'black',
  border: '1px solid white',
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

export default Accounts;