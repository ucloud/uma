var fs = require('fs');
var _ = require('underscore');
var api = require('./api.js');


/** monitor disk readonly
*/
function collect(callback) {
  var memInfos = {};
  fs.readFile('/proc/mounts', {flag: 'r'}, function(err, data) {
    if (err) {
      callback(err);
    }
    var lines = data.toString().split('\n');

    lines = _.reject(lines, function (line) {
      return line.length === 0;
    });
    console.log(lines);
    var roList = _.reduce(lines, function (acc, cur) {
      var mountElements = cur.split(' ');
      var device = mountElements[0];
      var mountInfo = mountElements[3];

      if (/^\/dev\//.test(device)) {
        if (/^ro/.test(mountInfo)) {
          acc.push(device);
        }
      }
      return acc;
    }, []);
    console.log(roList);
    var roCount = roList.length;
    var roObject = new api.ReportObject('ReadonlyDiskCount', roCount);
    callback(null, roObject);
  });
}

exports.collect = collect;
