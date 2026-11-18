import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./errors";
import type { ApiErrorResponse } from "@/types";

export function ok<T extends object>(body: T, status = 200) {
  return NextResponse.json({ success: true, ...body }, { status, headers: { "Cache-Control": "no-store" } });
}

export function handleError(err: unknown) {
  let status = 500;
  let code = "INTERNAL_ERROR";
  let message = "Something went wrong on our side. Please try again.";

  if (err instanceof ApiError) {
    ({ status, code, message } = err);
  } else if (err instanceof ZodError) {
    status = 400;
    code = "INVALID_REQUEST";
    message = "That request wasn't valid.";
  } else if (err instanceof SyntaxError) {
    status = 400;
    code = "INVALID_JSON";
    message = "Request body must be valid JSON.";
  } else {
    console.error(err);
  }
  const body: ApiErrorResponse = { success: false, error: { code, message } };
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
