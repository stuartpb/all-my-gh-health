#!/usr/bin/env node

var request = require("request");

var username = process.argv[2];

function jsonRequest(url, cb) {
  request({
    url: url,
    headers: {
      'User-Agent': 'request',
      'Accept': 'application/vnd.github.moondragon-preview+json'
    },
    json: true
  }, cb);
}

function receiveRepos(err, res, body) {
  body.forEach(function(repo) {
    if (!repo.fork) {
      request('https://raw.githubusercontent.com/' +
        repo.full_name +
        (/^([^\/]+)\/\1\.github\.(com|io)$/.test(repo.full_name) ?
          '/master' : '/gh-pages') +
        '/CNAME', function (err, res, body) {
          if (res.statusCode == 200) console.log(body.trim());
        });
    }
  });
  var nextLink = res.headers.link.match(/<([^>]*)>; rel="next"/);
  if (nextLink) {
    jsonRequest(nextLink[1],receiveRepos);
  }
}

jsonRequest('https://api.github.com/users/'+username+'/repos', receiveRepos);
