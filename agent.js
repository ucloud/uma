var conf = require('./config.json');
var lutil = require('./util.js');
var senderMaker = require('./sender.js');
var mem = require('./monitor_mem.js');
var disk = require('./monitor_disk.js');
var vmstat = require('./monitor_vmstat.js');
var rostat = require('./monitor_ro.js');
var _ = require('underscore');


//get eth0 ip
var os = require('os');
var ipv4Obj = _.filter(os.networkInterfaces().eth0, function (curFace) {
  return curFace.family === 'IPv4';
});

var ip = ipv4Obj[0].address;

//console.log(ip);

function progn(sender, interval) {
  setInterval(function () {
    mem.collect(sender);
    disk.collect(sender);
    vmstat.collect(sender);
    rostat.collect(sender);
  }, interval);
}

if (_.has(conf, 'uuid')) {
  var sender = senderMaker.mkSender(conf);
  progn(sender, conf.dataIntervalSec);
} else {
  console.log('please wait, we should get host id first');
  var idSender = senderMaker.mkIP2IDReq(conf);
  idSender(null, {IP: ip}, progn);
}
