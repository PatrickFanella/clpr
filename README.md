# CLPR

**Find the Twitch moments worth keeping.**

CLPR is a place to discover, organize, and share Twitch clips. Find a moment from
a favorite streamer, collect clips into playlists, and give other viewers a way
to return to the good parts.

[Explore CLPR](https://clpr.tv) · [Product overview](https://subcult.tv/products/clpr) · [Report a bug or suggest a feature](https://git.subcult.tv/subculture-collective/clpr/issues)

![CLPR home and clip discovery](https://subcult.tv/screenshots/clpr-home-1440.webp)

## From a clip to a collection

- **Discover:** browse Twitch clips and search for the moments you want to revisit.
- **Collect:** save clips into playlists instead of losing them in a stream of links.
- **Share:** submit existing clips and share collections with other viewers.
- **Discuss:** add community context through comments and interactions, with
  moderation and reporting tools.

CLPR puts curation at the center. A clip can be a joke, a highlight, or the start
of a conversation; a collection gives those moments a home.

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
