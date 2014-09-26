var exec = require('child_process').exec;
var _ = require('underscore');
var api = require('./api.js');
var lutil = require('./util.js');

exports.collect = function collect(callback) {
  exec('vmstat 1 3', function(err, stdout, stderr) {
    if (err) {
      callback(err);
    }
    var vms = stdout.split(/\n/);
    vms = _.last(_.initial(vms));
    vms = _.map(vms.trim().split(/\s+/), function (curStr) {
      return parseInt(curStr, 10);
    });

    var rq = vms[0];
    var sq = vms[1];
    var runnableObject = new api.ReportObject("RunnableProcessCount",
                                              rq);
    var unintSleepObject = new api.ReportObject("BlockProcessCount",
                                                sq);
    callback(null, runnableObject);
    callback(null, unintSleepObject);
  });
};
