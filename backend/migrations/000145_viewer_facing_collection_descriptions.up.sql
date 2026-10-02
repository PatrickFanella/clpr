-- Collection descriptions are shown to viewers on /discover. Describe what a
-- viewer gets, not how the script that builds the list works.
UPDATE playlist_scripts
SET description = CASE name
    WHEN 'Clip of the Day' THEN 'One clip a day: the strongest by momentum, audience and freshness.'
    WHEN 'Viral Velocity' THEN 'The clips gaining views fastest right now.'
    WHEN 'Fresh Faces' THEN 'Standout clips from creators with only a few clips on clpr.'
    WHEN 'Creator Roulette' THEN 'One standout clip from each of a varied set of creators, refreshed daily.'
    WHEN 'Across the Culture' THEN 'A daily tour across topics, one creator at a time.'
    WHEN 'Weekend Mix' THEN 'A weekly mix with one clip per creator across a spread of topics.'
    WHEN 'Hidden Gems' THEN 'Clips people watch all the way through that have not found a big audience yet.'
    WHEN 'Community Favorites' THEN 'The clips people save and come back to most.'
    WHEN 'Breakout Board' THEN 'Creators whose recent clips are beating their usual numbers.'
    WHEN 'Deep Cuts Weekly' THEN 'A weekly set of underrated clips with strong watch-through.'
    WHEN 'Binge Loop' THEN 'Clips that keep people watching for several in a row.'
    WHEN 'Hot Takes' THEN 'The clips drawing the most comments and debate.'
    WHEN 'Trending Now' THEN 'Top clips from the creators and categories drawing the biggest audiences on Twitch right now.'
    WHEN 'Discovery Mix' THEN 'Clips from outside Twitch''s biggest categories, refreshed daily.'
    ELSE description
END,
updated_at = NOW()
WHERE name IN ('Clip of the Day', 'Viral Velocity', 'Fresh Faces', 'Creator Roulette', 'Across the Culture', 'Weekend Mix', 'Hidden Gems', 'Community Favorites', 'Breakout Board', 'Deep Cuts Weekly', 'Binge Loop', 'Hot Takes', 'Trending Now', 'Discovery Mix');

UPDATE playlists p
SET description = s.description,
    updated_at = NOW()
FROM playlist_scripts s
WHERE p.script_id = s.id
  AND s.name IN ('Clip of the Day', 'Viral Velocity', 'Fresh Faces', 'Creator Roulette', 'Across the Culture', 'Weekend Mix', 'Hidden Gems', 'Community Favorites', 'Breakout Board', 'Deep Cuts Weekly', 'Binge Loop', 'Hot Takes', 'Trending Now', 'Discovery Mix');
