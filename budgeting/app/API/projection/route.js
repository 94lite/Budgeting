import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Expense from "@/constants/expense";
import Income from "@/constants/income";
import { ShiftingQueue, Node } from "@/constants/shifting-queue";
import { getTodayDate } from "@/constants/dates";
import { findNextPaymentDate } from "@/constants/payments-utility";

export const GET = async (request) => {
  // request parameters
  const { searchParams } = request.nextUrl;
  const minimum = parseInt(searchParams.get("minimum") || 0);
  const maximum = parseInt(searchParams.get("maximum") || 0);
  const custom = searchParams.get("custom") !== undefined ? parseFloat(searchParams.get("custom") || 0) : undefined;
  const offset = parseFloat(searchParams.get("offset") || 0);
  const from = searchParams.get("from") || getTodayDate();
  const to = searchParams.get("to");

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

  // parsing
  setup(from, expenses, paidExpenses);

  // response
  const response = NextResponse.json({});
  return response;
};

const compareFunction = (comparing, toInsert) => {
  return toInsert.nextPayDate < comparing.nextPayDate;
}

const setup = (from, items, paidItems) => {
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
  while (queue.head) {
    console.log(queue.pop().value);
  }
};

const parsePaidItems = (items) => {
  return items.reduce((acc, cur) => {
    const { expenditure, income } = cur;
    const key = expenditure || income;
    acc[key] = cur;
    return acc;
  }, {});
}

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
