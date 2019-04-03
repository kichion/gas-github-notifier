function githubAccessToken() {
  return PropertiesService.getScriptProperties().getProperty("GITHUB_ACCESS_TOKEN");
}

function slackWebhookUrl() {
  return PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL");
}
