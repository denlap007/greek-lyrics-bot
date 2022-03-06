# greek-lyrics-bot
**Telegram Bot** to look up Greek song lyrics, using as source https://stixoi.info

## Contents
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Quickstart](#quickstart)
  - [Docker](#docker)
  - [License](#license)

## Requirements

Node.js **v16** or higher

## Installation

```js
npm install
```

## Quickstart

```js
npm start
```

## Docker

The application is dockerized and can be run by starting a container.

#### Run docker container

Set the BOT_TOKEN environment variable at runtime

```sh
docker run -d --name greek-lyrics-bot -e "BOT_TOKEN=<THE BOT TOKEN>" denlap/greek-lyrics-bot
```

## License

Licensed under [GPL v3.0]

[gpl v3.0]: https://www.gnu.org/licenses/gpl-3.0.en.html
