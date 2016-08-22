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

// When authenticated, we can get the pages' CNAME from the GitHub Pages API
function getCnameAuthenticated(repo) {
  return jsonRequest('https://api.github.com/repos/' +
    repo.full_name + '/pages', function (err, res, body) {
      if (err) throw err;
      if (res.statusCode == 200 && body.cname)
        console.log(body.cname);
    });
}

// Without authentication, we can only clumsily check if a CNAME file exists
// in the location where we'd expect it
function getCnameAnonymously(repo) {
  return request('https://raw.githubusercontent.com/' +
    repo.full_name +
    (/^([^\/]+)\/\1\.github\.(com|io)$/.test(repo.full_name) ?
      '/master' : '/gh-pages') +
    '/CNAME', function (err, res, body) {
      if (err) throw err;
      if (res.statusCode == 200) console.log(body.trim());
    });
}

function receiveRepos(err, res, body) {
  if (err) throw err;
  body.forEach(function(repo) {
    if (!repo.fork && repo.has_pages) {
      if (authToken) {
        getCnameAuthenticated(repo);
      } else {
        getCnameAnonymously(repo);
      }
    }
  });
  var nextLink = res.headers.link.match(/<([^>]*)>; rel="next"/);
  if (nextLink) {
    jsonRequest(nextLink[1],receiveRepos);
  }
}

jsonRequest('https://api.github.com/users/'+username+'/repos', receiveRepos);
