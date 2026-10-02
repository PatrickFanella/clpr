-- Restore the descriptions in place before 000145.
UPDATE playlist_scripts
SET description = CASE name
    WHEN 'Clip of the Day' THEN 'A daily spotlight on the strongest current clip, balancing momentum, audience size, and freshness.'
    WHEN 'Viral Velocity' THEN 'Automatically refreshed playlist highlighting clips with the fastest recent momentum.'
    WHEN 'Fresh Faces' THEN 'Daily playlist surfacing standout clips from newer creators so discovery does not get stuck on the usual suspects.'
    WHEN 'Creator Roulette' THEN 'Daily variety rail with one standout clip per creator so the homepage stays diverse and surprising.'
    WHEN 'Across the Culture' THEN 'A daily, lightly shuffled tour led by distinct creators and spread across the topics shaping live culture.'
    WHEN 'Weekend Mix' THEN 'A weekly quality-and-surprise mix capped at one clip per creator with a soft topic cap.'
    WHEN 'Hidden Gems' THEN 'Daily playlist of sleeper-hit clips with strong retention that deserve a much bigger audience.'
    WHEN 'Community Favorites' THEN 'Automatically refreshed playlist of the clips people save and come back to most often.'
    WHEN 'Breakout Board' THEN 'Daily spotlight on creators whose recent clips are outperforming their usual baseline.'
    WHEN 'Deep Cuts Weekly' THEN 'Weekly playlist of underrated gems with strong watch-through and engagement.'
    WHEN 'Binge Loop' THEN 'Daily playlist of clips that tend to keep people watching through multi-clip sessions.'
    WHEN 'Hot Takes' THEN 'Daily playlist of the clips that sparked the most debate, reactions, and comment-fueled chaos.'
    WHEN 'Trending Now' THEN 'Automatically imports and publishes a fresh mix of top clips from Twitch''s current hottest creators and categories.'
    WHEN 'Discovery Mix' THEN 'Daily discovery playlist pulling clips from beyond Twitch''s main categories to keep the catalog surprising.'
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
