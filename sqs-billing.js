const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');

AWS.config.update({region: 'us-east-1'});
const billingEventQueueUrl = process.env.AWS_SQS_BILLING_EVENT_QUEUE;

exports.handleSQSMessage = function(message){
    var json = JSON.parse(message.Body);
    var json2 = JSON.parse(json.Message);
    var body = {
        start: json2.start,
        end: json2.end
    };
    console.log(body);
}

exports.sqsApp = Consumer.create({
    queueUrl: billingEventQueueUrl,
    handleMessage: module.exports.handleSQSMessage,
    sqs: new AWS.SQS()
});

exports.handleError = function(err){
    console.log(err);
}

module.exports.sqsApp.on('error', (err) => {
    module.exports.handleError(err);
});

module.exports.sqsApp.on('processing_error', (err) => {
});

module.exports.sqsApp.start();
