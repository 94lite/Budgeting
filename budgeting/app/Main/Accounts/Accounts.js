import React, { useState } from "react";
import ExpensesAccount from "./ExpensesAccount";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const Accounts = props => {
  return (
    <div className="accounts">
      <Account title="Cheque">
        <SubAccount title="Day Budget" value={45.5} />
        <SubAccount title="Free Spending" />
      </Account>
      <Account title="Savings">
        <SubAccount title="Budget Buffer" value={227.5} />
        <SubAccount title="Collection" value={0} />
        <SubAccount title="Expenses Buffer">
          <ExpensesAccount
            lastIncomeDate="2023-09-14"
          />
        </SubAccount>
        <SubAccount title="Savings" value={0} />
      </Account>
      <Account title="Credit">
        <SubAccount title="Credit" value={8000 - 7013.25} />
      </Account>
    </div>
  )
};

const Account = props => {
  const { title, children } = props;

  return (
    <div className="account savings-account">
      <div>{title}</div>
      <div className="account-content">
        <div className="panel left-panel">
          {children}
        </div>
        <div className="panel right-panel"></div>
      </div>
    </div>
  )
}

const SubAccount = props => {
  const { title, value, children } = props;
  const [open, setOpen] = useState(false);

  return (
    <div className="sub-account">
      <div className="sub-account-summary" onClick={() => setOpen(true)}>
        <div className="key">{title}</div>
        <div className="value">$ {(value || 0).toFixed(2)}</div>
      </div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        keepMounted={true}
      >
        <Box sx={modalStyle}>
          {children}
        </Box>
      </Modal>
    </div>
  )
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: "red",
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: "center"
};

export default Accounts;