import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { spectrum } from "@/constants/dates";
import Expense from "@/constants/expense";
import { findNextPaymentDate, getPrevDate, getNextDate } from "@/constants/payments-utility";
import { dateToString } from "@/constants/dates";

export const GET = async (request) => {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const freq = searchParams.get("frequency");
  const prisma = new PrismaClient();
  const expenses = await prisma.expenditures.findMany();
  const data = expenses.map(expense => {
    const expenseObj = new Expense(expense);
    const { expenditure, frequency, frequencyValue } = expenseObj;
    const amount = expenseObj.getAmount();

    let lowerBound;
    let upperBound;
    let dateDate = date ? new Date(date) : new Date();
    const dateStr = dateToString(dateDate);
    let nextPayDate = findNextPaymentDate(dateToString(dateDate), frequency, frequencyValue);
    const nextPayDateStr = dateToString(nextPayDate);

    const previousPayDates = [];
    const futurePayDates = [];
    const output = {
      expenditure,
      amount,
      dividedAmount: amount,
      amountInBuffer: amount,
      nextPayDate: nextPayDateStr,
      previousPayDates,
      futurePayDates
    };
    if (spectrum.indexOf(freq) > spectrum.indexOf(frequency)) {
      lowerBound = dateDate;
      upperBound = getNextDate(dateToString(dateDate), freq);
      while (nextPayDate <= upperBound) {
        futurePayDates.push(dateToString(nextPayDate));
        nextPayDate = getNextDate(nextPayDate, frequency);
      }
      output["dividedAmount"] = amount * futurePayDates.length;
      output["amountInBuffer"] = output["dividedAmount"];
    } else if (spectrum.indexOf(freq) < spectrum.indexOf(frequency)) {
      lowerBound = getPrevDate(nextPayDateStr, frequency);
      upperBound = nextPayDate;
      while (dateDate < upperBound) {
        futurePayDates.push(dateToString(dateDate));
        dateDate = getNextDate(dateToString(dateDate), freq);
      }
      dateDate = getPrevDate(dateStr, freq);
      while (dateDate >= lowerBound) {
        previousPayDates.push(dateToString(dateDate));
        dateDate = getPrevDate(dateToString(dateDate), freq);
      }
      previousPayDates.reverse();
      output["dividedAmount"] = amount/(previousPayDates.length + futurePayDates.length);
      output["amountInBuffer"] = output["dividedAmount"] * (previousPayDates.length + 1);
    } else {
      futurePayDates.push(nextPayDateStr);
    }
    return output;
  });
  const response = NextResponse.json(data);
  return response;
};
