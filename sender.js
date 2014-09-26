var _ = require('underscore');
var request = require('request');
var querystring = require('querystring');
var lutil = require('./util.js'); //means local util
var log = require('./monitor_log.js');
var fs = require('fs');

/**
 * return a sender function as a sender callback
 */
function mkSender(conf) {
  var urlPrefix = conf.dataHost + ':' + conf.dataPort + '/?';
  return function (err, data) {
    if (err) {
      return;
    }
    _.extend(data, {
      "Action": "PutMetricData",
      "PublicKey": conf.publicKey,
      "ResourceID": conf.uuid,
      "Region": conf.region
    });
    data  = lutil.sign(data, conf.privateKey);
    var urlComplete = urlPrefix + (querystring.stringify(data));
    request.get(urlComplete, function (err, res, body) {
      if (err) {
        log.error('send metric data fail');
        return;
      }
    });
  };
}

function mkIP2IDReq(conf) {
  var urlPrefix = conf.dataHost + ':' + conf.dataPort + '/?';
  return function (err, data, successCallback) {
    if (err) {
      return;
    }
    _.extend(data, {
      "Action": "GetIDByPrivateIP",
      "PublicKey": conf.publicKey,
      "Region": conf.region
    });
    data  = lutil.sign(data, conf.privateKey);
    var urlComplete = urlPrefix + (querystring.stringify(data));
    request.get(urlComplete, function (err, res, body) {
      if (err) {
        log.error('send metric data fail');
        return;
      }
      console.log(res.statusCode);
      console.log(JSON.parse(body));
      var getIDRes = JSON.parse(body);
      //we get id success
      if (getIDRes.RetCode === 0 && _.has(getIDRes, 'ID')) {
        var newConf = _.extend(conf, {uuid: getIDRes.ID});
        fs.writeFileSync('./config.json', JSON.stringify(newConf, null, 2));
        var newSender = mkSender(newConf);
        successCallback(newSender, newConf.dataIntervalSec);
      } else {
        console.log('sorry, can not get host id for reporting monitoring data');
        console.log('please check you config or you can contact our support team!');
        process.exit(-1);
      }
    });
  };
}
exports.mkSender = mkSender;
exports.mkIP2IDReq = mkIP2IDReq;
