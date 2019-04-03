function fetch_pullreq_data_by_graphql(owner, repository) {
  const graphql_query = 
    '{\
  repository(owner: "' + owner + '", name: "' + repository + '") {\
    name\
    pullRequests(last: 20, states: OPEN) {\
      nodes {\
        title\
        url\
        author {\
          login\
        }\
        reviewRequests(last: 20) {\
          nodes {\
            requestedReviewer {\
              ... on User {\
                login\
              }\
            }\
          }\
        }\
        comments(last: 50) {\
          nodes {\
            author {\
              login\
              avatarUrl(size: 20)\
            }\
            body\
            createdAt\
            updatedAt\
            url\
          }\
        }\
        reviews(last: 50) {\
          nodes {\
            author {\
              login\
            }\
            url\
            comments(last: 50) {\
              nodes {\
                author {\
                  login\
                  avatarUrl(size: 20)\
                }\
                replyTo {\
                  author {\
                    login\
                  }\
                }\
                body\
                createdAt\
                updatedAt\
                url\
              }\
            }\
          }\
        }\
      }\
    }\
  }\
}';

  const option = buildRequestOption(graphql_query);
  return UrlFetchApp.fetch("https://api.github.com/graphql", option);
}

function buildRequestOption(graphql) {
  return {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: "bearer " + githubAccessToken(),
    },
    payload: JSON.stringify({ query: graphql }),
  };
}
