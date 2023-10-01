import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Expense from "@/constants/expense";
import Income from "@/constants/income";
import { ShiftingQueue, Node } from "@/constants/shifting-queue";
import { getTodayDate, getEndOfYear, dateToString } from "@/constants/dates";
import { findNextPaymentDate } from "@/constants/payments-utility";

export const GET = async (request) => {
  // request parameters
  const { searchParams } = request.nextUrl;
  const minimum = parseInt(searchParams.get("minimum") || 0);
  const maximum = parseInt(searchParams.get("maximum") || 0);
  const custom = searchParams.get("custom") !== undefined ? parseFloat(searchParams.get("custom") || 0) : undefined;
  const offset = parseFloat(searchParams.get("offset") || 0);
  const from = searchParams.get("from") || getTodayDate();
  const to = searchParams.get("to") || getEndOfYear();

  // database retrieval
  const prisma = new PrismaClient();
  const expenses = await prisma.expenditures.findMany();
  const paidExpenses = await prisma.expenditure_payments.findMany({
    where: { due_date: { gte: from } }
  });
  const incomes = await prisma.incomes.findMany();
  const paidIncomes = await prisma.income_payments.findMany({
    where: { due_date: { gte: from } }
  });

  // setup
  const expensesQueue = setupQueue(from, expenses, paidExpenses);
  const incomesQueue = setupQueue(from, incomes, paidIncomes);
  getTrend(from, to, expensesQueue, incomesQueue);

  // response
  const response = NextResponse.json({
    minimum: minimum ? minimum : undefined,
    custom: custom ? custom : undefined,
    maximum: maximum ? maximum : undefined
  });
  return response;
};

// ____________________
// P A R S I N G
const parsePaidItems = (items) => {
  return items.reduce((acc, cur) => {
    const { expenditure, income } = cur;
    const key = expenditure || income;
    acc[key] = cur;
    return acc;
  }, {});
};

const getObjectForm = item => {
  if (item.hasOwnProperty("expenditure")) {
    return new Expense(item);
  } else if (item.hasOwnProperty("income")) {
    return new Income(item);
  }
  return null;
};

const setNextPaymentDate = (from, item) => {
  const { frequency, frequencyValue } = item;
  const nextPayDate = findNextPaymentDate(from, frequency, frequencyValue);
  item.nextPayDate = nextPayDate;
};

// ____________________
// B U S I N E S S
const setupQueue = (from, items, paidItems) => {
  const paidItemsReference = parsePaidItems(paidItems);
  const itemObjects = items.map(item => {
    const obj = getObjectForm(item);
    setNextPaymentDate(from, obj);
    const key = obj.expenditure || obj.income;
    if (key in paidItemsReference) {
      const { due_date, amount_progress } = paidItemsReference[key]
      const latest = new Date(due_date);
      obj.nextPayDate = latest;
      if (amount_progress >= obj.getAmount()) {
        obj.setPaid();
      } else {
        obj.progress = amount_progress;
      }
    }
    return obj;
  });
  const queue = new ShiftingQueue();
  itemObjects.forEach(item => {
    queue.insert(new Node(item), compareFunction);
  });
  return queue;
};

const getTrend = (startStrDate, endStrDate, expensesQueue, incomesQueue) => {
  let value = 0;
  const current = new Date(startStrDate);
  const end = new Date(endStrDate);
  let nextExpense = expensesQueue.peek().value;
  let nextIncome = incomesQueue.peek().value;
  while (current <= end) {
    const events = [];
    while ((nextExpense !== null) && (current >= nextExpense.nextPayDate)) {
      if (!nextExpense.paid) {
        const amount = nextExpense.getAmount();
        value = value - amount;
        events.push(`Ex:${nextExpense.expenditure}:(-${amount})`);
      }
      expensesQueue.pop();
      nextExpense.setNextDate();
      expensesQueue.insert(new Node(nextExpense), compareFunction);
      nextExpense = expensesQueue.peek().value;
    }
    while ((nextIncome !== null) && (current >= nextIncome.nextPayDate)) {
      if (!nextIncome.paid) {
        const amount = nextIncome.getAmount()
        value = value + amount;
        events.push(`In:${nextIncome.income}:(+${amount})`);
      }
      incomesQueue.pop();
      nextIncome.setNextDate();
      incomesQueue.insert(new Node(nextIncome), compareFunction);
      nextIncome = incomesQueue.peek().value;
    }
    console.log(value, events);
    current.setDate(current.getDate() + 1);
  }
}

// ____________________
// U T I L I T Y
const compareFunction = (comparing, toInsert) => {
  return toInsert.nextPayDate < comparing.nextPayDate;
};
