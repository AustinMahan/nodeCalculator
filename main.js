'use strict';

var fs = require('fs');
var path = require('path');
var guestpath = path.join(__dirname, 'memory.json');

var http = require('http');
var port = process.env.PORT || 8000;

var server = http.createServer(function (req, res) {
  var urlArr = req.url.split('/');
  var operation = urlArr[1];
  var num1 = parseFloat(urlArr[2]);
  var num2 = parseFloat(urlArr[3]);
  console.log(operation, num1, num2);
  res.setHeader('Content-type', 'text/plain');
  switch (operation) {
    case 'add':
      var out = (num1 + num2).toFixed(2);
      break;
    case 'mult':
      var out = (num1 * num2).toFixed(2);
      break;
    case 'sub':
      var out = (num1 - num2).toFixed(2);
      break;
    case 'div':
      var out = (num1 / num2).toFixed(2);
      break;
    case 'memory':
      fs.readFile(guestpath, 'utf8', function(err, data) {
        if (err) {
          throw err;
        }
        res.setHeader('Content-type', 'application/json')
        res.end(data)
      })
    default:
      res.statusCode = 400;
      var out = 'Not valid operation';
  }
  fs.readFile(guestpath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var contents = JSON.parse(data);
    contents.push(out);
    var outJson = JSON.stringify(contents)
    fs.writeFile(guestpath, outJson, function (err) {
      if (err) {
        throw err;
      }
    });
    res.end(out);
  });
});

server.listen(port, function () {
  console.log(`listening on port ${port}`);
});
