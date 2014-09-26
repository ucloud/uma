var _ = require('underscore');
var stdutil = require('util');

function complement(pred) {
  return function () {
    return !pred.apply(null, _.toArray(arguments));
  };
}

var sha1 = function(str) {
    var crypto = require("crypto").createHash("sha1");
    return crypto.update(str, 'utf8').digest('hex');
};

exports.sign = function(params, private_key) {
  var params_data = "";
  delete params.Signature;

  _.each(_.keys(params).sort(), function (key) {
    params_data += key;
    params_data += params[key];
  });

  return _.extend(params, {Signature: sha1(params_data + private_key)});
};

//steal from underscore.string
exports.startsWith = function(str, starts){
  if (starts === '') return true;
  if (str == null || starts == null) return false;
  str = String(str); starts = String(starts);
  return str.length >= starts.length && str.slice(0, starts.length) === starts;
};

exports.endsWith = function(str, ends){
  if (ends === '') return true;
  if (str == null || ends == null) return false;
  str = String(str); ends = String(ends);
  return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
};

module.exports.complement = complement;

/** console -r*/
exports.expansole = function expansole(obj) {
  console.log(stdutil.inspect(obj, {showHidden: false, depth: null}));
};
