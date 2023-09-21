import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const GET = async (request) => {
  const prisma = new PrismaClient();
  const data = await prisma.expenditures.findMany();
  const response = NextResponse.json(data);
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
