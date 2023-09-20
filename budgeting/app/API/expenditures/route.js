import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const GET = async (request) => {
  const prisma = new PrismaClient();
  const data = await prisma.expenditures.findMany();
  const trend = doStuff(data);
  const response = NextResponse.json(trend);
  return response;
};

export const POST = async (request) => {
  // Adds a new entry to expenditures
};

export const PATCH = async (request) => {
  // Updates an existing entry
  // The values before the update gets inserted to the expenditures_history table
};

export const DELETE = async (request) => {
  // Removes an existing entry
  // The removed history gets added to the expenditures_history table
};


const doStuff = items => {
  const from = new Date(2023, 8, 20);
  const to = new Date(2023, 11, 31);
  const expenses = getExpenses(items, from);
  const trend = calculate(from, to, expenses);
  return trend;
};

const getExpenses = (items, start) => {
  const expenses = {
    yearly: [],
    monthly: [],
    fortnightly: [],
    weekly: [],
    daily: []
  }
  const dayNum = start.getDay();
  const day = start.getDate();
  const month = start.getMonth();
  items.forEach(item => {
    const { frequency, frequency_value } = item;
    let paid = false;
    if (frequency_value) {
      switch (frequency) {
        case "yearly":
          break;
        case "monthly":
          if (day >= parseInt(frequency_value)) {
            paid = true;
          }
          break;
        case "fortnightly":
          break;
        case "weekly":
          if (
            (dayNum >= days.indexOf(frequency_value))
            && !(
              (dayNum !== 0)
              && (days.indexOf(frequency_value) === 0)
            )
          ) {
            paid = true;
          }
          break;
        case "daily":
        default:
          break;
      }
    }
    expenses[frequency].push(new Expense(item, paid))
  })
  return expenses
}

const calculate = (from, to, expenses) => {
  const { yearly, monthly, fortnightly, weekly, daily } = expenses;

  let latest = 0;
  const trend = [];
  let current = from;
  let paid = [];

  let dayNum;
  let dayName;
  let day;
  let month;
  let lastDay;
  let trigger = false;
  while (current <= to) {
    dayNum = current.getDay();
    dayName = days[dayNum];
    day = current.getDate();
    month = current.getMonth();
    lastDay = daysInMonth[month];
    yearly.forEach(expense => {
      const { frequencyValue } = expense;
      if (!expense.paid) {
        if (frequencyValue) {
          const [m, d] = frequencyValue;
          if (month === m && day === d) {
            latest = latest - expense.getValue();
            expense.setPaid(true);
            paid.push(expense.expenditure);
          }
        }
      }
    });
    monthly.forEach(expense => {
      if (!expense.paid) {
        if (expense.frequencyValue === day) {
          latest = latest - expense.getAmount();
          expense.setPaid(true);
          paid.push(expense.expenditure);
        }
      }
    });
    if (trigger) {
      fortnightly.forEach(expense => {
        if (!expense.paid) {
          if (expense.frequencyValue === dayName) {
            latest = latest - expense.getAmount();
            expense.setPaid(true);
            paid.push(expense.expenditure);
          }
        }
      });
      if (dayName === "Thursday") {
        latest = latest + 2000;
      }
    }
    weekly.forEach(expense => {
      if (!expense.paid) {
        if (expense.frequencyValue === dayName) {
          latest = latest - expense.getAmount();
          expense.setPaid(true);
          paid.push(expense.expenditure);
        }
      }
    });
    daily.forEach(expense => {
      latest = latest - expense.getAmount();
      paid.push(expense.expenditure);
    });
    if (dayName === "Sunday") {
      weekly.forEach(expense => {
        if (!expense.paid) {
          latest = latest - expense.getAmount();
          paid.push(expense.expenditure);
        }
        expense.setPaid(false);
      });
      if (trigger) {
        fortnightly.forEach(expense => {
          if (!expense.paid) {
            latest = latest - expense.getAmount();
            paid.push(expense.expenditure);
          }
          expense.setPaid(false);
        });
      }
      trigger = !trigger;
    }
    if (day === lastDay) {
      monthly.forEach(expense => {
        if (!expense.paid) {
          latest = latest - expense.getAmount();
          paid.push(expense.expenditure);
        }
        expense.setPaid(false);
      });
    }
    if (month === 11 && day === lastDay) {
      yearly.forEach(expense => {
        if (!expense.paid) {
          latest = latest - expense.getAmount();
          paid.push(expense.expenditure);
        }
        expense.setPaid(false);
      });
    }
    trend.push([months[month], day, dayName, latest, paid]);
    current.setDate(current.getDate() + 1);
    paid = [];
  }
  return trend;
};

class Expense {
  constructor(props, paid) {
    const {
      id, expenditure,
      type, fixed,
      amount,
      minimum, maximum,
      frequency, frequency_value
    } = props;
    this.expenditure = expenditure;
    this.paid = paid || false;
    this.fixed = fixed;
    this.amount = amount;
    this.minimum = minimum;
    this.maximum = maximum;
    this.frequency = frequency;
    this.frequencyValue = this.parseFrequencyValue(frequency, frequency_value);
  }

  parseFrequencyValue(frequency, frequency_value) {
    if (frequency_value === null) {
      return null;
    }
    switch (frequency) {
      case "yearly":
        return;
      case "monthly":
        return parseInt(frequency_value);
      case "fortnightly":
      case "weekly":
        return frequency_value;
      case "daily":
      default:
        return null;
    }
  }

  setPaid(status) {
    this.paid = status;
  }
  
  getAmount() {
    if (this.fixed) {
      return this.amount;
    }
    return this.maximum || this.minimum;
  }
}

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
]

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

const daysInMonth = [
  31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
]