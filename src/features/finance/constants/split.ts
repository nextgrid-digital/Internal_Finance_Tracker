/**
 * Share of the net distributable amount that the company retains.
 *
 * Fixed business constant (25%). The remaining 75% is the member pool, split
 * between members according to each member's `split_percentage` (stored in the
 * `members` table and editable in the Members page).
 */
export const COMPANY_SHARE_PCT = 0.25;

export const MEMBER_POOL_PCT = 1 - COMPANY_SHARE_PCT;
