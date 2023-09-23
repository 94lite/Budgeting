import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const GET = async (request) => {
  const prisma = new PrismaClient();
  const incomes = await prisma.incomes.findMany();
  const expenditures = await prisma.expenditures.findMany();

  const dailyIncome = incomes.reduce((acc, cur) => {
    return acc + getDailyUnit(cur);
  }, 0);

  const dailyExpend = expenditures.reduce((acc, cur) => {
    return acc + getDailyUnit(cur);
  }, 0);
  const dailyDiff = dailyIncome - dailyExpend;

  const weeklyIncome = incomes.reduce((acc, cur) => {
    return acc + getWeeklyUnit(cur);
  }, 0);
  const weeklyExpend = expenditures.reduce((acc, cur) => {
    return acc + getWeeklyUnit(cur);
  }, 0);
  const weeklyDiff = weeklyIncome - weeklyExpend;

  const fortnightlyIncome = incomes.reduce((acc, cur) => {
    return acc + getFortnightlyUnit(cur);
  }, 0);
  const fortnightlyExpend = expenditures.reduce((acc, cur) => {
    return acc + getFortnightlyUnit(cur);
  }, 0);
  const fortnightlyDiff = fortnightlyIncome - fortnightlyExpend;

  const monthlyIncome = incomes.reduce((acc, cur) => {
    return acc + getMonthlyUnit(cur);
  }, 0);
  const monthlyExpend = expenditures.reduce((acc, cur) => {
    return acc + getMonthlyUnit(cur);
  }, 0);
  const monthlyDiff = monthlyIncome - monthlyExpend;

  const yearlyIncome = incomes.reduce((acc, cur) => {
    return acc + getYearlyUnit(cur);
  }, 0);
  const yearlyExpend = expenditures.reduce((acc, cur) => {
    return acc + getYearlyUnit(cur);
  }, 0);
  const yearlyDiff = yearlyIncome - yearlyExpend;

  const response = NextResponse.json({
    daily: {
      incomes: dailyIncome,
      expenditures: dailyExpend,
      difference: dailyDiff
    },
    weekly: {
      incomes: weeklyIncome,
      expenditures: weeklyExpend,
      difference: weeklyDiff
    },
    fortnightly: {
      incomes: fortnightlyIncome,
      expenditures: fortnightlyExpend,
      difference: fortnightlyDiff
    },
    monthly: {
      incomes: monthlyIncome,
      expenditures: monthlyExpend,
      difference: monthlyDiff
    },
    yearly: {
      incomes: yearlyIncome,
      expenditures: yearlyExpend,
      difference: yearlyDiff
    }
  });
  return response;
};

const getDailyUnit = property => {
  const { frequency, amount, minimum, maximum } = property;
  const value = (amount || 0) + (minimum || 0) + (maximum || 0);

  switch (frequency) {
    case "yearly":
      return value/365;
    case "monthly":
      return value*12/365;
    case "fortnightly":
      return value/14;
    case "weekly":
      return value/7;
    case "daily":
    default:
      return value;
  }
};

const getWeeklyUnit = property => {
  const { frequency, amount, minimum, maximum } = property;
  const value = (amount || 0) + (minimum || 0) + (maximum || 0);

  switch (frequency) {
    case "yearly":
      return value/365*7;
    case "monthly":
      return value*12/365*7;
    case "fortnightly":
      return value/2;
    case "daily":
      return value*7;
    case "weekly":
    default:
      return value;
  }
};

const getFortnightlyUnit = property => {
  const { frequency, amount, minimum, maximum } = property;
  const value = (amount || 0) + (minimum || 0) + (maximum || 0);

  switch (frequency) {
    case "yearly":
      return value/365*14;
    case "monthly":
      return value*12/365*14;
    case "weekly":
      return value*2;
    case "daily":
      return value*14;
    case "fortnightly":
    default:
      return value;
  }
};

const getMonthlyUnit = property => {
  const { frequency, amount, minimum, maximum } = property;
  const value = (amount || 0) + (minimum || 0) + (maximum || 0);

  switch (frequency) {
    case "yearly":
      return value/12;
    case "fortnightly":
      return value/14*365/12;
    case "weekly":
      return value/7*365/12;
    case "daily":
      return value*365/12;
    case "monthly":
    default:
      return value;
  }
};

const getYearlyUnit = property => {
  const { frequency, amount, minimum, maximum } = property;
  const value = (amount || 0) + (minimum || 0) + (maximum || 0);

  switch (frequency) {
    case "monthly":
      return value*12;
    case "fortnightly":
      return value/14*365;
    case "weekly":
      return value/7*365;
    case "daily":
      return value*365;
    case "yearly":
    default:
      return value;
  }
};