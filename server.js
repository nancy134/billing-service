const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const braintreeAPI = require('./braintreeAPI');
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');

AWS.config.update({region: 'us-east-1'});
const newUserQueueUrl = "https://sqs.us-east-1.amazonaws.com/461318555119/new-user-billing";

const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("billing-service");
});

app.get('/getClientToken', (req, res) => {
    braintreeAPI.getClientToken().then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.get('/findCustomer/:id', (req, res) => {
    console.log("req.params:");
    console.log(req.params);
    braintreeAPI.findCustomer(req.params.id).then(function(result){
        console.log(result);
        res.send(result);
    }).catch(function(err){
        console.log(err);
        res.send(err);
    });
});

const sqsApp = Consumer.create({
    queueUrl: newUserQueueUrl,
    handleMessage: async(message) => {
        var json = JSON.parse(message.Body);
        var json2 = JSON.parse(json.Message);
        console.log(json2);
        console.log("-----------------------------------------------------");
        var body = {
            email: json2.email,
            cognitoId: json2.userSub
        }
    },
    sqs: new AWS.SQS()
});

sqsApp.on('error', (err) => {
    console.log(err);
});
sqsApp.on('processing_error', (err) => {
    console.log(err);
});
sqsApp.start();
app.listen(PORT, HOST);
