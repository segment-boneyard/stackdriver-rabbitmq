var _        = require('underscore')
  , CronJob  = require('cron').CronJob
  , rabbitmq = require('rabbitmq-monitor');

// TODO
// create a chron job that runs every minute
// use rabbitmq to get whatever stats desired
// send each stat to stackdriver
// http://feedback.stackdriver.com/knowledgebase/articles/181488-sending-custom-metrics-to-the-stackdriver-system