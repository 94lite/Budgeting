const data = [
  {
    key: "rent",
    type: ["compulsory"],
    frequency: "weekly",
    frequencyValue: "Wednesday",
    amount: 220
  },
  {
    key: "mum's allowance",
    type: ["compulsory"],
    frequency: "fortnightly",
    frequencyValue: "Friday",
    amount: 200
  },
  {
    key: "AKMC donation",
    type: ["compulsory"],
    frequency: "weekly",
    frequencyValue: "Sunday",
    amount: 20
  },
  {
    key: "bills",
    type: ["compulsory", "approximate"],
    frequency: "weekly",
    frequencyValue: null,
    amount: 30
  },
  {
    key: "fuel",
    type: ["compulsory", "approximate"],
    frequency: "fortnightly",
    frequencyValue: null,
    amount: 180
  },
  {
    key: "car registration",
    type: ["compulsory"],
    frequency: "yearly",
    frequencyValue: null,
    amount: 106.15
  },
  {
    key: "credit payment",
    type: ["compulsory", "variable"],
    frequency: "monthly",
    frequencyValue: "15",
    minimum: 500
  },
  {
    key: "credit interest",
    type: ["compulsory", "approximate", "variable"],
    frequency: "monthly",
    frequencyValue: "15",
    maximum: 150
  },
  {
    key: "2Degrees",
    type: ["compulsory"],
    frequency: "monthly",
    frequencyValue: "15",
    amount: 125.41
  },
  {
    key: "Les Mills",
    type: ["subscription"],
    frequency: "monthly",
    frequencyValue: "1",
    amount: 143
  },
  {
    key: "Adobe",
    type: ["subscription", "approximate"],
    frequency: "monthly",
    frequencyValue: "11",
    amount: 17
  },
  {
    key: "Netflix",
    type: ["subscription"],
    frequency: "monthly",
    frequencyValue: "17",
    amount: 18.49
  }
];

export default data;