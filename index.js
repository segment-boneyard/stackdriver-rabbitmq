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
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Total Queued Messages', totalMessages);

        // Messages ready
        var readyMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages_ready);
        }, 0);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Total Ready Messages', readyMessages);

        // Messages unacked
        var unackedMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages_unacknowledged);
        }, 0);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Total Unacknowledged Messages', unackedMessages);
    });

    // Memory information
    // http://www.rabbitmq.com/memory-use.html
    rabbitmq.memory(function (memory) {
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Total', memory.total);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Processes', memory.processes);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Processes Used', memory.processes_used);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: System', memory.system);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Atom', memory.atom);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Atom Used', memory.atom_used);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Binary', memory.binary);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: Code', memory.code);
        stackdriver.sendMetric('['+hostname+'] RabbitMQ Memory: ETS', memory.ets);
    });
};


// execute on a chron
new CronJob({
    cronTime : '00 * * * * *', // runs every minute
    onTick   : collectMetrics,
    start    : true,
    timeZone : 'America/Los_Angeles'
});

