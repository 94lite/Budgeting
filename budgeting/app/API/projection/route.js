import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Expense from "./expense";
import { days, months, daysInMonth } from "./constants";

export const GET = async (request) => {
  const { searchParams } = request.nextUrl;
  const minimum = parseInt(searchParams.get("minimum") || 0);
  const maximum = parseInt(searchParams.get("maximum") || 0);
  const custom = parseFloat(searchParams.get("custom") || 0);
  const offset = parseFloat(searchParams.get("offset") || 0);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const prisma = new PrismaClient();
  const data = await prisma.expenditures.findMany();
  const response = NextResponse.json({
    minimum: minimum ? getTrend(data, from, to, "minimum", offset) : undefined,
    maximum: maximum ? getTrend(data, from, to, "maximum", offset) : undefined,
    custom: custom ? getTrend(data, from, to, custom, offset) : undefined
  });
  return response;
};

const getTrend = (items, from, to, dailyOption, offset) => {
  const today = new Date();
  const fromDate = new Date(from || `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  const toDate = new Date(to || `${today.getFullYear()}-12-31`);
  if (fromDate >= toDate) {
    return [];
  }
  const expenses = getExpenses(items, fromDate);
  switch (dailyOption) {
    case "maximum":
      expenses.daily.push(new Expense({
        expenditure: "daily budget",
        fixed: true,
        amount: 45.50,
        frequency: "daily"
      }));
      break;
    case "minimum":
      break;
    default:
      expenses.daily.push(new Expense({
        expenditure: "daily budget",
        fixed: true,
        amount: dailyOption,
        frequency: "daily"
      }));
      break;
  }
  const trend = calculate(fromDate, toDate, expenses, offset);
  return trend;
};

const getExpenses = (items, start) => {
  const expenses = {
    yearly: [],
    monthly: [],
    fortnightly: [],
    weekly: [],
    daily: []
  };
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
    expenses[frequency].push(new Expense(item, paid));
  });
  return expenses;
};

const calculate = (from, to, expenses, offset) => {
  const { yearly, monthly, fortnightly, weekly, daily } = expenses;

  let latest = offset || 0;
  const trend = [];
  let current = from;
  let outgoing = [];

  let dayNum;
  let dayName;
  let day;
  let month;
  let year;
  let lastDay;
  let trigger = false;
  while (current <= to) {
    dayNum = current.getDay();
    dayName = days[dayNum];
    day = current.getDate();
    month = current.getMonth();
    year = current.getFullYear();
    lastDay = daysInMonth(month, year);

    yearly.forEach(expense => {
      const { frequencyValue } = expense;
      if (!expense.paid && frequencyValue) {
        const [m, d] = frequencyValue;
        if (month === m && day === d) {
          latest = latest - expense.getValue();
          expense.setPaid(true);
          outgoing.push(expense.expenditure);
        }
      }
    });
    latest = checkAndPay(monthly, day, latest, outgoing);
    if (trigger) {
      latest = checkAndPay(fortnightly, dayName, latest, outgoing);
      if (dayName === "Thursday") {
        latest = latest + 2065.21;
      }
    }
    latest = checkAndPay(weekly, dayName, latest, outgoing);
    daily.forEach(expense => {
      latest = latest - expense.getAmount();
      outgoing.push(expense.expenditure);
    });

    if (dayName === "Sunday") {
      latest = calcRemainingAndReset(weekly, latest, outgoing);
      if (trigger) {
        latest = calcRemainingAndReset(fortnightly, latest, outgoing);
      }
      trigger = !trigger;
    }
    if (day === lastDay) {
      latest = calcRemainingAndReset(monthly, latest, outgoing);
    }
    if (month === 11 && day === lastDay) {
      latest = calcRemainingAndReset(yearly, latest, outgoing);
    }
    trend.push({
      date: `${day} ${months[month]}, ${dayName}`,
      value: latest,
      outgoing
    });

    current.setDate(current.getDate() + 1);
    outgoing = [];
  }
  return trend;
};

const checkAndPay = (expenses, compare, latest, outgoing) => {
  expenses.forEach(expense => {
    if (!expense.paid && expense.frequencyValue === compare) {
      latest = latest - expense.getAmount();
      expense.setPaid(true);
      outgoing.push(expense.expenditure);
    }
  });
  return latest;
};

const calcRemainingAndReset = (expenses, latest, outgoing) => {
  expenses.forEach(expense => {
    if (!expense.paid) {
      latest = latest - expense.getAmount();
      outgoing.push(expense.expenditure)
    }
    expense.setPaid(false);
  });
  return latest;
};
