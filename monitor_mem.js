var fs = require('fs');
var _ = require('underscore');
var api = require('./api.js');

exports.collect = function collect(callback) {
  var memInfos = {};
  fs.readFile('/proc/meminfo', {flag: 'r'}, function(err, data) {
    if (err) {
      callback(err);
    }
    var lines = _.map(data.toString().split('\n'), function (line) {
      line = line.replace(/\s+/, ' ');
      line = line.replace(/\skB/, '');
      line = line.replace(/\:/, '');
      return line;
    });
    lines = _.reject(lines, function (line) {
      return line.length === 0;
    });
    //console.log(lines);
    _.reduce(lines, function (acc, line) {
      var pair = line.split(' ');
      var value = parseInt(pair[1], 10);

      if (!_.isNaN(value)) {
        acc[pair[0]] = value;
      }
      return acc;
    }, memInfos);

    var usage = (memInfos.MemTotal - memInfos.MemFree - memInfos.Buffers - memInfos.Cached) /
      memInfos.MemTotal * 100;
    usage = parseInt(usage, 10);
    var memUsuage = new api.ReportObject('MemUsage', usage);

    callback(null, memUsuage);
  });
};
