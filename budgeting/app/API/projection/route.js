import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Expense from "./expense";
import Income from "./income";
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
  const expenses = await prisma.expenditures.findMany();
  const incomes = await prisma.incomes.findMany();
  const response = NextResponse.json({
    minimum: minimum ? getTrend(expenses, incomes, from, to, "minimum", offset) : undefined,
    maximum: maximum ? getTrend(expenses, incomes, from, to, "maximum", offset) : undefined,
    custom: custom ? getTrend(expenses, incomes, from, to, custom, offset) : undefined
  });
  return response;
};

const getTrend = (expenseItems, incomeItems, from, to, dailyOption, offset) => {
  const today = new Date();
  const fromDate = new Date(from || `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`);
  const toDate = new Date(to || `${today.getFullYear()}-12-31`);
  if (fromDate >= toDate) {
    return [];
  }
  const expenses = getObjects(expenseItems, fromDate);
  const incomes = getObjects(incomeItems, fromDate);
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
  console.log(incomes)
  const trend = calculate(fromDate, toDate, expenses, incomes, offset);
  return trend;
};

const getObjects = (items, start) => {
  const objects = {
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
    if (item.hasOwnProperty("expenditure")) {
      objects[frequency].push(new Expense(item, paid));
    } else if (item.hasOwnProperty("income")) {
      objects[frequency].push(new Income(item, paid));
    }
  });
  return objects;
};

const calculate = (from, to, expenses, incomes, offset) => {
  const { yearly: yearlyEx, monthly: monthlyEx, fortnightly: fortnightlyEx, weekly: weeklyEx, daily: dailyEx } = expenses;
  const { yearly: yearlyIn, monthly: monthlyIn, fortnightly: fortnightlyIn, weekly: weeklyIn, daily: dailyIn } = incomes;

  let latest = offset || 0;
  const trend = [];
  let current = from;
  let events = [];

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

    yearlyEx.forEach(expense => {
      const { frequencyValue } = expense;
      if (!expense.paid && frequencyValue) {
        const [m, d] = frequencyValue;
        if (month === m && day === d) {
          latest = latest - expense.getValue();
          expense.setPaid(true);
          events.push(expense.expenditure);
        }
      }
    });
    yearlyIn.forEach(income => {
      const { frequencyValue } = income;
      if (!income.paid && frequencyValue) {
        const [m, d] = frequencyValue;
        if (month === m && day === d) {
          latest = latest + income.getValue();
          income.setPaid(true);
          events.push(income.income);
        }
      }
    });
    latest = checkAndPay(monthlyEx, day, latest, events);
    latest = checkAndPay(monthlyIn, day, latest, events);
    if (trigger) {
      latest = checkAndPay(fortnightlyEx, dayName, latest, events);
      latest = checkAndPay(fortnightlyIn, dayName, latest, events);
    }
    latest = checkAndPay(weeklyEx, dayName, latest, events);
    latest = checkAndPay(weeklyIn, dayName, latest, events);
    dailyEx.forEach(expense => {
      latest = latest - expense.getAmount();
      events.push(expense.expenditure);
    });
    dailyIn.forEach(income => {
      latest = latest + income.getAmount();
      events.push(income.income);
    });

    if (dayName === "Sunday") {
      latest = calcRemainingAndReset(weeklyEx, latest, events);
      latest = calcRemainingAndReset(weeklyIn, latest, events);
      if (trigger) {
        latest = calcRemainingAndReset(fortnightlyEx, latest, events);
        latest = calcRemainingAndReset(fortnightlyIn, latest, events);
      }
      trigger = !trigger;
    }
    if (day === lastDay) {
      latest = calcRemainingAndReset(monthlyEx, latest, events);
      latest = calcRemainingAndReset(monthlyIn, latest, events);
    }
    if (month === 11 && day === lastDay) {
      latest = calcRemainingAndReset(yearlyEx, latest, events);
      latest = calcRemainingAndReset(yearlyIn, latest, events);
    }
    trend.push({
      date: `${day} ${months[month]}, ${dayName}`,
      value: latest,
      events
    });

    current.setDate(current.getDate() + 1);
    events = [];
  }
  return trend;
};

const checkAndPay = (items, compare, latest, events) => {
  items.forEach(item => {
    if (!item.paid && item.frequencyValue === compare) {
      if (item.hasOwnProperty("expenditure")) {
        latest = latest - item.getAmount();
        events.push(`Ex:${item.expenditure}`);
      } else if (item.hasOwnProperty("income")) {
        latest = latest + item.getAmount();
        events.push(`In:${item.income}`);
      }
      item.setPaid(true);
    }
  });
  return latest;
};

const calcRemainingAndReset = (items, latest, events) => {
  items.forEach(item => {
    if (!item.paid) {
      if (item.hasOwnProperty("expenditure")) {
        latest = latest - item.getAmount();
        events.push(`Ex:${item.expenditure}`);
      } else if (item.hasOwnProperty("income")) {
        latest = latest + item.getAmount();
        events.push(`In:${item.income}`);
      }
    }
    item.setPaid(false);
  });
  return latest;
};
