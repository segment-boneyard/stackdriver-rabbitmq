stackdriver-rabbitmq
====================

A nodecron that checks on rabbitmq's status, and submits the stats to Stackdriver once a minute.

## Usage

### Setup

1. Install node.js
2. git clone https://github.com/segmentio/stackdriver-rabbitmq.git

### Configuration
Copy `conf.template.js` to `conf.js` and fill it in with your own configuration:

* `apiKey` and `customerId` come from [Stackdriver](https://app.stackdriver.com/settings/apikeys)
* `virtualHostPath` is the virtual host path on the RabbitMQ instance you want to monitor

### Run
`node stackdriver-rabbitmq/index.js`

You'll probably want to [run it in the background](http://stackoverflow.com/questions/4018154/node-js-as-a-background-service/15616912#15616912).

## License

```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```

(The MIT License)

Copyright (c) 2013 Segment.io Inc. <friends@segment.io>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.