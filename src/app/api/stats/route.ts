import { getDb, DEMO_USER_ID } from "@/lib/db";
import { getStats } from "@/lib/matching";
import { handleError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return ok(await getStats(getDb(), DEMO_USER_ID));
  } catch (err) {
    return handleError(err);
  }
}
