var exec = require('child_process').exec;
var _ = require('underscore');
var api = require('./api.js');
var lutil = require('./util.js');

exports.collect = function collect(callback) {
  var blockInfos = {};

  exec('df -m', function(err, stdout, stderr) {
    if (err) {
      callback(err);
    }
    var fss = stdout.split(/\n/);
    fss = _.filter(_.rest(fss), function (fs) {
      return lutil.startsWith(fs, '/dev');
    });
    _.reduce(fss, function (acc, fs) {
      var items = fs.split(/[ \t]+/);
      acc[_.first(items)] = _.rest(items);
      return acc;
    }, blockInfos);

    _.each(blockInfos, function (value, key) {
      var usage = parseInt(_.last(_.initial(value)), 10);
      if (_.last(value) === "/") {
        var rootUsageObject = new api.ReportObject("RootSpaceUsage",
                                                      usage);
        callback(null, rootUsageObject);
      } else if (key === '/dev/vdb') {
        var dataUsageObject = new api.ReportObject("DataSpaceUsage",
                                                      usage);
        callback(null, dataUsageObject);
      }
    });
  });

};
