import { NextResponse } from "next/server";
import data from "@/constants/expenditures";

export const GET = async (request) => {
  const response = NextResponse.json(data);
  return response;
};
