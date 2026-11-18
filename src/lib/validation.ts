import { z } from "zod";

export const swipeBodySchema = z.object({
  profileId: z.string().trim().min(1).max(64),
  action: z.enum(["like", "pass"]),
});

export type SwipeBody = z.infer<typeof swipeBodySchema>;
