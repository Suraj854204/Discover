# Product Recommendations (Part A)

> **Status: hypotheses.** These were written without hands-on exploration of the real Coy app, so nothing here describes its actual interface or behaviour. Each proposal should be validated against the real product before being prioritised. They are grounded only in the privacy-first, mutual-interest model this assignment describes.

## 1. Gentle "Why you might click" prompts on profiles

**User problem (hypothesis).** In swipe-style discovery, decisions are made on a photo in seconds, and people often struggle to start a conversation after matching because they know little about each other.

**Proposed solution.** Let each profile show one optional prompt (for example, "A perfect Sunday is…") alongside its interests. When a match happens, the match screen surfaces the one prompt or interest the two people share as a conversation starter.

**Why Coy needs it.** It adds substance to the like decision and gives matches an easy first message, without adding pressure.

**Expected user benefit.** More considered likes, and fewer matches that go quiet for lack of a first line.

**Privacy implications.** Low risk. Shared-interest highlights are computed only after a mutual match, so nothing is revealed about a non-mutual person. Prompts are voluntary and shown only on profiles the person chose to publish.

**Implementation complexity.** Low–medium: one optional field on profiles, a small UI change on the card, and a server-side overlap computation on match creation.

## 2. Private "Maybe later" shelf

**User problem (hypothesis).** Some people feel forced into a binary like/pass on someone who is interesting but not a clear yes, so they pass out of caution and lose the connection permanently.

**Proposed solution.** A third, private action, "Save for later", that removes the profile from the deck and places it in a personal shelf the user can revisit and convert into a like or pass. Saved profiles are treated as neither like nor pass for matching.

**Why Coy needs it.** It reduces regret and decision fatigue while keeping the like-is-private promise intact.

**Expected user benefit.** Calmer browsing and fewer lost potential connections.

**Privacy implications.** The shelf is visible only to its owner and must never signal anything to the saved person. Saving must not count as interest in any matching rule. The shelf should be excluded from any analytics shared outside the user's account.

**Implementation complexity.** Medium: a new swipe state and shelf view, plus rules so the feed, match logic and API treat the new state correctly (and tests proving it can never create a match).
