/*jslint devel: true, node: true, bitwise: false, debug: false, eqeq: false,
evil: false, forin: false, newcap: false, nomen: false, plusplus: false,
regexp: false, sub: false, vars: false, undef: false, unused: false,
white: false, quotmark: single, indent: 2, maxlen: 80 */

'use strict';
// node libraries
var fs = require('fs');
// node modules

var xml2js = require('xml2js');
var _ = require('underscore');

var viewPath = './app/views';

function traverse(jsonData) {
  if (typeof jsonData === 'object') {
    _.each(jsonData, function (value, string) {
      if (string === '$') {
        var object, keys = Object.keys(value);
        keys.sort();
        object = {};
        _.each(keys, function (key) {

          object[key] = value[key];
        });
        jsonData[string] = object;
      } else {
        traverse(value);
      }
    });
  }
  return jsonData;
}

// onload function
(function () {
  var files, xmlData;

  files = fs.readdirSync(viewPath);
  xmlData = fs.readFileSync(viewPath + '/' + files[0], {'encoding' : 'utf8'});
  xml2js.parseString(xmlData,
    function (err, jsonData) {

    var builder, json2xml, jsonFormattedData = traverse(jsonData);

    builder = new xml2js.Builder();
    json2xml = builder.buildObject(jsonFormattedData);
    fs.writeFileSync(viewPath + '/' + files[0], json2xml);
    console.log('formatted xml. Beautiful right :)');
  });
}());
