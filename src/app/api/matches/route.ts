import { getDb, DEMO_USER_ID } from "@/lib/db";
import { getMatches } from "@/lib/matching";
import { handleError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const matches = await getMatches(getDb(), DEMO_USER_ID);
    return ok({ count: matches.length, matches });
  } catch (err) {
    return handleError(err);
  }
}
