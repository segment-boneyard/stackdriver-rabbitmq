var _           = require('underscore')
  , CronJob     = require('cron').CronJob
  , rabbitmq    = require('rabbitmq-monitor')
  , Stackdriver = require('stackdriver-custom')
  , conf        = require('./conf.js');

var stackdriver = new Stackdriver(conf);

var collectMetrics = function () {

    // Queue information
    var fields = ['messages', 'messages_ready', 'messages_unacknowledged','name'];
    rabbitmq.listQueues(conf.virtualHostPath, fields, function (queues) {

        // Total messages
        var totalMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages);
        }, 0);
        stackdriver.sendMetric('RabbitMQ Total Queued Messages', totalMessages);

        // Messages ready
        var readyMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages_ready);
        }, 0);
        stackdriver.sendMetric('RabbitMQ Total Ready Messages', readyMessages);

        // Messages unacked
        var unackedMessages = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages_unacknowledged);
        }, 0);
        stackdriver.sendMetric('RabbitMQ Total Unacknowledged Messages', unackedMessages);
    });

    // Memory information
    rabbitmq.memory(function (memory) {
        stackdriver.sendMetric('RabbitMQ Memory: Total', memory.total);
        stackdriver.sendMetric('RabbitMQ Memory: Processes', memory.processes);
        stackdriver.sendMetric('RabbitMQ Memory: Processes Used', memory.processes_used);
        stackdriver.sendMetric('RabbitMQ Memory: System', memory.system);
        stackdriver.sendMetric('RabbitMQ Memory: Atom', memory.atom);
        stackdriver.sendMetric('RabbitMQ Memory: Atom Used', memory.atom_used);
        stackdriver.sendMetric('RabbitMQ Memory: Binary', memory.binary);
        stackdriver.sendMetric('RabbitMQ Memory: Code', memory.code);
        stackdriver.sendMetric('RabbitMQ Memory: ETS', memory.ets);
    });
};


// execute on a chron
new CronJob({
    cronTime : '00 * * * * *', // runs every minute
    onTick   : collectMetrics,
    start    : true,
    timeZone : 'America/Los_Angeles'
});

