var log4js = require('log4js');

log4js.configure({
  appenders: [
    {type: 'file', filename: '/var/log/agent.log', category: 'agent'}
  ]
});
var log = log4js.getLogger('agent');

log.setLevel('ERROR');
exports = module.exports = log;
