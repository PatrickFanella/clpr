# CLPR

**Somebody clipped it. It's probably in here.**

CLPR sorts Twitch clips by creator, topic and tag. Search for the one you half
remember, save clips into playlists, and send a playlist to the people who
missed the stream.

[Explore CLPR](https://clpr.tv) · [Product overview](https://subcult.tv/products/clpr) · [Report a bug or suggest a feature](https://git.subcult.tv/subculture-collective/clpr/issues)

![CLPR home and clip discovery](https://subcult.tv/screenshots/clpr-home-1440.webp)

## What it does

- **Browse and search:** find Twitch clips by creator, topic, tag or Twitch category.
- **Playlists:** save clips into playlists and share them.
- **Submit:** send in an existing Twitch clip that isn't on CLPR yet.
- **Vote and comment:** upvotes and comments move clips in the feed. Reporting
  and moderation tools cover the rest.

## Available today

CLPR is available as a responsive web application at [clpr.tv](https://clpr.tv).
Native mobile apps are planned. Stream clip extraction, live feeds, watch parties,
and media mirroring remain outside the current release. The
[launch feature inventory](docs/LAUNCH_FEATURE_INVENTORY.md) records the supported scope.

## Build with us

CLPR is open source, with a React and TypeScript web client, Go API, and PostgreSQL
storage. Start with the [development guide](DEVELOPMENT.md) for configuration,
local services, and verification, or the [contributor guide](docs/contributing.md)
to work on a change.

- [Backend setup](backend/README.md)
- [API reference](docs/openapi/README.md)
- [Operations runbooks](docs/operations/runbooks/README.md)

Built by [Subcult](https://subcult.tv). Licensed under [MIT](LICENSE).
