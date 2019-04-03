function notice_relation_comments() {
  if (isHoliday())
    return;

  // ref. https://api.slack.com/methods/channels.list/test
  var target_users = [
    {name: "hogehoge", channel: "{channel_id}"}
  ];

  // 現在日時を取得してメッセージ取得する時間幅を計算する
  var now = new Date();
  var logtime = now.setMinutes(now.getMinutes() - 5);
    
  target_users.forEach(function(target_user) {
    all_repositories().forEach(function(repository_name){
      var json = fetch_repostiroy_json(repository_name);
      var repository = json.data.repository;

      var attachments = [];
      repository.pullRequests.nodes.forEach(function(pullRequest) {
        Array.prototype.push.apply(attachments, build_relation_comments_attachment(repository, pullRequest, logtime, target_user.name));
      });
      if (!attachments.length)
        return;
    
      send_message("", target_user.channel, attachments);
    });
  });
}

function fetch_repostiroy_json(repo) {
  var response = fetch_pullreq_data_by_graphql(repo);
  var json = response.getContentText();
  return JSON.parse(json);
}

function build_relation_comments_attachment(repository, pullRequest, logtime, user_name) {
    result = []
    pullRequest.comments.nodes.forEach(function(comment) {
      if (!is_delivery_target(pullRequest, user_name, comment, logtime))
        return;
      result.push(create_attachment(repository, pullRequest, comment));
    });
  
    pullRequest.reviews.nodes.forEach(function(review) {
      review.comments.nodes.forEach(function(comment) {
        if (!is_delivery_target(pullRequest, user_name, comment, logtime))
          return;
        result.push(create_attachment(repository, pullRequest, comment));
      });
    });
    return result;
}
    
function create_attachment(repository, pullRequest, comment) {
  return {
    "color": "#a8bdff",          
    "author_name": comment.author.login,
    "author_icon": comment.author.avatarUrl,
    "title": "comment link",
    "title_link": comment.url,
    "text": comment.body,
    "footer": "[" + repository.name + "] " + pullRequest.title,
    "footer_icon": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    "footer_link": pullRequest.url,
    "mrkdwn_in": ["text", "footer"]
  }
}
    
function is_delivery_target(pullRequest, user_name, comment, logtime) {
  // コメントの時間をフィルタして通知する
  if (new Date(comment.createdAt) < logtime)
    return false;

  // コメント記入者なら通知しない
  if (comment.author.login === user_name)
    return false;

  // コメントのリプライ先なら通知する
  if (comment.replyTo && comment.replyTo.author.login === user_name)
    return true;
  
  // プルリクの作成者なら通知
  if (pullRequest.author.login === user_name)
    return true;
    
  // 本文に自分宛てのメンションがあるなら通知
  if (comment.body.indexOf(user_name) !== -1)
    return true;
    
  return false;
}
