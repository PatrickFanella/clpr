-- The fallback account created in 000104 authors the pinned forum welcome
-- thread, so its internal name is shown to visitors. Give it a public name and
-- fix the welcome thread's leaderboard link.
UPDATE users
SET username = 'clpr-team',
    display_name = 'clpr team',
    updated_at = NOW()
WHERE twitch_id = 'migration-system-admin'
  AND NOT EXISTS (SELECT 1 FROM users WHERE username = 'clpr-team');

UPDATE forum_threads
SET content = REPLACE(content, '(/leaderboard)', '(/leaderboards)')
WHERE title = 'Welcome to the clpr Forum!' AND pinned = true;
