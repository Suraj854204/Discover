import { getDb, DEMO_USER_ID } from "@/lib/db";
import { recordSwipe } from "@/lib/matching";
import { swipeBodySchema } from "@/lib/validation";
import { handleError, ok } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { profileId, action } = swipeBodySchema.parse(await request.json());
    return ok(await recordSwipe(getDb(), DEMO_USER_ID, profileId, action));
  } catch (err) {
    return handleError(err);
  }
}
