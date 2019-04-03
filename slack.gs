function send_message(message, channel, attachments) {
  var url = slackWebhookUrl();
  var payload = {
    channel: channel,
    text: message,
    username: "GitHuby",
    icon_emoji: ":zap:",
    attachments: attachments,
  }
  var option = {
    'method': 'post',
    'payload': JSON.stringify(payload),
    'contentType': 'application/x-www-form-urlencoded; charset=utf-8',
    'muteHttpExceptions': true
  };
  var response = UrlFetchApp.fetch(url, option);
  Logger.log(response);
}
