import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { getTodayDate } from "@/utility/dates";

export const GET = async (request) => {
  const { searchParams } = request.nextUrl;
  const from = searchParams.get("from") || getTodayDate();

  const prisma = new PrismaClient();
  const data = await prisma.expenditure_payments.findMany({
    where: { due_date: { gte: from } }
  });
  const response = NextResponse.json(data);
  return response;
};
