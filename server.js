const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const braintreeAPI = require('./braintreeAPI');
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const userService = require('./user');
const jwt = require('./jwt');
const billingCycleService = require('./billingCycle');
const billingEventService = require('./billingEvent');
const billingSqs = require('./sqs-billing');
const utilities = require('./utilities');

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

function errorResponse(res, err){
    if (err.statusCode){
        res.status(err.statusCode).send(err);
    } else {
        res.status(400).send(err);
    }
}

app.get('/getClientToken', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    braintreeAPI.getClientToken(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/paymentMethod', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    braintreeAPI.createPaymentMethod(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/paymentMethod', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    braintreeAPI.getPaymentMethod(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/billingCycles', (req, res) => {
    var authParms = jwt.getAuthParams(req);
    billingCycleService.create(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingCycles', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var where = null;
    var authParams = jwt.getAuthParams(req);
    billingCycleService.getBillingCycles(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingCycles/:id', (req, res) => {
    var id = req.params.id;
    var authParams = jwt.getAuthParams(req);
    billingCycleService.getBillingCycle(authParams, id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingEvents', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var authParams = jwt.getAuthParams(req);
    var where = null;
    billingEventService.getBillingEvents(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});

app.delete('/billingCycles/:id/billingEvents', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    var id = req.params.id;
    billingEventService.deleteBillingEvents(authParams, id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        console.log(err);
        res.send("error");
        //errorResponse(res, err);
    });
});

const sqsApp = Consumer.create({
    queueUrl: newUserQueueUrl,
    handleMessage: async(message) => {
        var json = JSON.parse(message.Body);
        var json2 = JSON.parse(json.Message);
        var body = {
            email: json2.email,
            cognitoId: json2.userSub
        }
        userService.create(body).then(function(result){
        }).catch(function(err){
            console.log(err);
        });
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
