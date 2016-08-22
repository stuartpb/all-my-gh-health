#!/usr/bin/env node

var request = require("request");

var username = process.argv[2];
var authToken = process.argv[3];

function jsonRequest(url, cb) {
  var headers = {
    'User-Agent': 'request',
  };
  if (authToken) {
    headers.Authorization = 'token '+ authToken;
  }
  request({
    url: url,
    headers: headers,
    json: true
  }, cb);
}

function requestAllRepos(url, cb) {
  function receiveRepos(err, res, body) {
    if (err) return cb(err);
    if (res.statusCode != 200) {
      console.log(body);
    }
    body.forEach(function(repo) {
      if (!repo.fork && repo.has_pages) {
        console.log(repo.full_name, repo.default_branch);
      }
    });
    var nextLink = res.headers.link &&
      res.headers.link.match(/<([^>]*)>; rel="next"/);
    if (nextLink) {
      jsonRequest(nextLink[1], receiveRepos);
    } else {
      return cb(null);
    }
  }
  jsonRequest(url, receiveRepos);
}

function crawlOrgs(err) {
  if (err) throw err;
  function requestAllOrgRepos(err, res, body) {
    if (err) throw err;
    var i = 0;
    function requestNextOrgRepos(err) {
      if (err) throw err;
      if (i < body.length) {
        var reposUrl = 'https://api.github.com/orgs/'+body[i].login+'/repos';
        i++;
        requestAllRepos(reposUrl, requestNextOrgRepos);
      }
    }
    requestNextOrgRepos();
  }
  jsonRequest('https://api.github.com/users/'+username+'/orgs',
    requestAllOrgRepos);
}

requestAllRepos('https://api.github.com/users/'+username+'/repos', crawlOrgs);
