stackdriver-rabbitmq
====================

A nodecron that checks on rabbitmq's status, and submits the stats to Stackdriver.

## Setup

1. [Install node.js](http://howtonode.org/how-to-install-nodejs)
2. git clone https://github.com/segmentio/stackdriver-rabbitmq.git
3. Create a new file "stackdriver-rabbitmq/conf.js" something like this:

```javascript
    module.exports = {
        "apiKey"          : "APIKEYAPIKEYAPIKEY", // replace with your API key
        "customerId"      : 1,                    // replace with your customer id
        "virtualHostPath" : "/"                   // replace with your host path
    };
```
  
4. forever start stackdriver-rabbitmq/index
