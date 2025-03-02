// Create web server
// 1. Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var comments = require('./comments');
var formidable = require('formidable');

// 2. Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var path = url.parse(request.url).pathname;
  switch (path) {
    case '/':
      fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) return send404(response);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data, 'utf8');
        response.end();
      });
      break;
    case '/comments':
      if (request.method === 'POST') {
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields) {
          comments.addComment(fields.comment);
          response.writeHead(200, { 'Content-Type': 'text/plain' });
          response.write('Thanks for the comment!');
          response.end();
        });
      } else {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(comments.getComments()), 'utf8');
        response.end();
      }
      break;
    default: send404(response);
  }
});

function send404(response) {
  response.writeHead(404);
  response.write('404');
  response.end();
}

// 3. Listen on port 8000, IP defaults to