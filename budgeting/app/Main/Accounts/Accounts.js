import React from "react";

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
        <SubAccount title="Expenses Buffer" />
        <SubAccount title="Savings" value={0} />
      </Account>
      <Account title="Credit">
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
  const { title, value } = props;

  return (
    <div className="sub-account">
      <div className="key">{title}</div>
      <div className="value">${(value || 0).toFixed(2)}</div>
    </div>
  )
}

export default Accounts;