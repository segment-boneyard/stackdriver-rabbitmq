var _           = require('underscore')
  , CronJob     = require('cron').CronJob
  , rabbitmq    = require('rabbitmq-monitor')
  , Stackdriver = require('stackdriver-custom')
  , conf        = require('./conf.js');


var hostname = require('os').hostname();
var stackdriver = new Stackdriver(conf);

var collectMetrics = function () {

    // Queue information
    var fields = ['messages', 'messages_ready', 'messages_unacknowledged','name'];
    rabbitmq.listQueues(conf.virtualHostPath, fields, function (queues) {

        // Total messages
        var totalMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages);
        }, 0);
        stackdriver.sendMetric('['+hostname+'] RMQ Queued Messages', totalMessages);

        // Messages ready
        var readyMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages_ready);
        }, 0);
        stackdriver.sendMetric('['+hostname+'] RMQ Ready Messages', readyMessages);

        // Messages unacked
        var unackedMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages_unacknowledged);
        }, 0);
        stackdriver.sendMetric('['+hostname+'] RMQ Unacked Messages', unackedMessages);
    });

    // Memory information
    // http://www.rabbitmq.com/memory-use.html
    rabbitmq.memory(function (memory) {
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Total', memory.total);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Connection Processes', memory.connection_procs);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Queue Processes', memory.queue_procs);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Other Processes', memory.other_proc);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Plugins', memory.plugins);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Mnesia', memory.mnesia);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Mgmt DB', memory.mgmt_db);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Msg Index', memory.msg_index);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Atom', memory.atom);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Binary', memory.binary);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Code', memory.code);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Other ETS', memory.other_ets);
        stackdriver.sendMetric('['+hostname+'] RMQ Memory: Other System', memory.other_system);
    });
};


// execute on a chron
new CronJob({
    cronTime : '00 * * * * *', // runs every minute
    onTick   : collectMetrics,
    start    : true,
    timeZone : 'America/Los_Angeles'
});

