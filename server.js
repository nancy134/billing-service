const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const braintreeAPI = require('./braintreeAPI');
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const userService = require('./user');
const jwt = require('./jwt');

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
    var IdToken = jwt.getToken(req);
    var cognitoClientId = req.query.cognitoClientId;
    var cognitoPoolId = req.query.cognitoPoolId;
    braintreeAPI.getClientToken(IdToken, cognitoClientId, cognitoPoolId).then(function(result){
        res.send(result);
    }).catch(function(err){
        if (err.statusCode){
            res.status(err.statusCode).send(err);
        } else {
            res.send(err);
        }
    });
});

app.get('/axiosTest', (req, res) => {
    var IdToken = jwt.getToken(req);
    var cognitoClientId = req.query.cognitoClientId;
    var cognitoPoolId = req.query.cognitoPoolId;
    braintreeAPI.axiosTest(IdToken, cognitoClientId, cognitoPoolId).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(400).send(err);
    });
});

app.get('/findCustomer/:id', (req, res) => {
    braintreeAPI.findCustomer(req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.send(err);
    });
});

app.post('/createCustomer', (req, res) => {
    var IdToken = jwt.getToken(req);
    braintreeAPI.createCustomer(IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.post('/paymentMethod', (req, res) => {
    var IdToken = jwt.getToken(req);
    braintreeAPI.createPaymentMethod(IdToken, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(500).send(err);
    });
});

app.get('/paymentMethod', (req, res) => {
    var IdToken = jwt.getToken(req);
    var cognitoClientId = req.query.cognitoClientId;
    var cognitoPoolId = req.query.cognitoPoolId;
    braintreeAPI.getPaymentMethod(IdToken, cognitoClientId, cognitoPoolId).then(function(result){
        res.send(result);
    }).catch(function(err){
        res.status(500).send(err);
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
