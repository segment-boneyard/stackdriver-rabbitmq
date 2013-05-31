var _           = require('underscore')
  , CronJob     = require('cron').CronJob
  , rabbitmq    = require('rabbitmq-monitor')
  , Stackdriver = require('stackdriver-custom')
  , conf        = require('./conf.js');

var stackdriver = new Stackdriver(conf);

var collectMetrics = function () {

    rabbitmq.listQueues(conf.virtualHostPath, 'messages name', function (queues) {
        var sum = _.reduce(queues, function (memo, queue) {
            return (memo + queue.messages);
        }, 0);

        sum += Math.random() * 100;
        stackdriver.sendMetric('test random messages count', sum);
    });
};


// execute on a chron
new CronJob({
    cronTime : '* * * * * *', // runs every minute
    onTick   : collectMetrics,
    start    : true,
    timeZone : 'America/Los_Angeles'
});

