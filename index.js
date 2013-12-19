var rabbitmq = require('rabbitmq-monitor');
var sum = require('sum.js');
var debug = require('debug')('stackdriver-rabbitmq');


/**
 * module `exports`.
 */

module.exports = collect;


/**
 * Collect our metrics and send them to the stackdriver instance.
 *
 * @param {Stackdriver} stackdriver
 * @param {Object} options
 */

function collect (stackdriver, options) {
  debug('collecting stackdriver metrics %j', options);

  var fields = [
    'messages',
    'messages_ready',
    'messages_unacknowledged',
    'name'
  ];

  // Send the total counts for our queues
  rabbitmq.listQueues(options.virtualHost, fields, function (queues) {
    var total = sum(queues, 'messages');
    var ready = sum(queues, 'messages_ready');
    var unacked = sum(queues, 'messages_unacknowledged');

    stackdriver
      .send('Rabbit Queued Messages', total)
      .send('Rabbit Ready Messages', ready)
      .send('Rabbit Unacked Messages', unacked);
  });

  // Send our memory metrics.
  rabbitmq.memory(function (memory) {
    stackdriver
      .send('Rabbit Memory: Total', memory.total)
      .send('Rabbit Memory: Connection Processes', memory.connection_procs)
      .send('Rabbit Memory: Queue Processes', memory.queue_procs)
      .send('Rabbit Memory: Other Processes', memory.other_proc)
      .send('Rabbit Memory: Plugins', memory.plugins)
      .send('Rabbit Memory: Mnesia', memory.mnesia)
      .send('Rabbit Memory: Mgmt DB', memory.mgmt_db)
      .send('Rabbit Memory: Msg Index', memory.msg_index)
      .send('Rabbit Memory: Atom', memory.atom)
      .send('Rabbit Memory: Binary', memory.binary)
      .send('Rabbit Memory: Code', memory.code)
      .send('Rabbit Memory: Other ETS', memory.other_ets)
      .send('Rabbit Memory: Other System', memory.other_system);
  });
}