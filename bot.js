import TelegramBot from "node-telegram-bot-api";
import got from "got";
import cheerio from "cheerio";

// replace the value below with the Telegram token you receive from @BotFather
const BOT_TOKEN = process.env.BOT_TOKEN;
const STIXOI_URL = "https://stixoi.info/stixoi.php";
const BASE_URL = "https://stixoi.info";
const NO_RESULT_MSG = "Could not find lyrics for this song";

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, {
  polling: true,
});

// Matches everythins
bot.onText(/(.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const matchedText = match[1]; // the captured text

  if (matchedText.startsWith("/start")) {
    bot.sendMessage(
      msg.chat.id,
      "Welcome, I will help you find lyrics of Greek songs.\n\nType a song title or use the /find command if you are in a group (see /help for examples). Let the singing begin..."
    );
  } else if (matchedText.startsWith("/help")) {
    bot.sendMessage(
      msg.chat.id,
      "Type a Greek song title or use the /find command to find its lyrics. You may also use the name of the lyricist, composer, singer to customize your search. \n\nExamples: φραγκοσυριανή, προσκυνητης αλκινοος ..."
    );
  } else if (matchedText.startsWith("/find")) {
    bot.sendMessage(msg.chat.id, "What song?", {
      reply_markup: {
        force_reply: true,
      },
    });
  } else {
    const response = await search(matchedText);

    bot.sendMessage(chatId, response);
  }
});

const search = async matchedText => {
  let message = NO_RESULT_MSG;

  try {
    const requestMatches = await findMatches(matchedText);

    // get the first match if any
    const matches = getFirstMatch(requestMatches);
    const title = matches[0];
    const urlPath = matches[1];

    if (urlPath) {
      const lyricsResponse = await got(`${BASE_URL}/${urlPath}`);
      const lyrics = getMatchLyrics(lyricsResponse.body);
      message = `${title}\n\n${lyrics}`;

      console.log(`Searched: ${matchedText}, matched title: ${title}`);
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  return message;
};

const getFirstMatch = html => {
  const $ = cheerio.load(html);
  const node = $("td.row1 a").first();

  return [node.text(), node.attr("href")];
};

const getMatchLyrics = html => {
  const $ = cheerio.load(html, {
    normalizeWhitespace: true,
    xmlMode: true,
  });
  const lyrics = $("META").get(5);

  return lyrics && lyrics.attribs && lyrics.attribs.CONTENT
    ? lyrics.attribs.CONTENT
    : NO_RESULT_MSG;
};

const findMatches = async title => {
  let response = "";

  try {
    const options = {
      searchParams: {
        keywords: title,
        act: "ss",
        info: "SS",
      },
    };
    const { body } = await got(STIXOI_URL, options);
    response = body;
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }

  return response;
};
