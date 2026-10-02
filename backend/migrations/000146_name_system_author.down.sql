UPDATE users
SET username = 'migration-system-admin',
    display_name = 'Migration System Admin',
    updated_at = NOW()
WHERE twitch_id = 'migration-system-admin';

UPDATE forum_threads
SET content = REPLACE(content, '(/leaderboards)', '(/leaderboard)')
WHERE title = 'Welcome to the clpr Forum!' AND pinned = true;
