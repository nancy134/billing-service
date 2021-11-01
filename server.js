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
const promotionService = require('./promotion');
const codeService = require('./code');
const userCodeService = require('./userCode');
const stripeService = require('./stripe');

AWS.config.update({region: 'us-east-1'});
const newUserQueueUrl = process.env.AWS_SQS_NEW_USER_BILLING_QUEUE;

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

app.delete('/billingCycles/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    billingCycleService.deleteBillingCycle(authParams, req.params.id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/billingCycles/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    billingCycleService.updateBillingCycle(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingCycles/:id/billingEvents', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var authParams = jwt.getAuthParams(req);
    var where = {BillingCycleId: req.params.id};
    billingEventService.getBillingEvents(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingCycles/:id/billingEvents/me', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var authParams = jwt.getAuthParams(req);
    var where = {BillingCycleId: req.params.id};
    billingEventService.getBillingEventsMe(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/billingCycles/:id/billingEvents', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    var id = req.params.id;
    billingEventService.deleteBillingEvents(authParams, id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        res.send("error");
    });
});


app.post('/promotions', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    promotionService.create(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/promotions', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var where = null;
    var authParams = jwt.getAuthParams(req);
    promotionService.getPromotions(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/promotions/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    promotionService.updatePromotion(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/promotions/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    promotionService.deletePromotion(authParams, req.params.id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/promotions/:id/codes', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    var id = req.params.id;
    req.body.PromotionId = id;
    codeService.create(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/promotions/:id/codes', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var where = {PromotionId: req.params.id};
    var authParams = jwt.getAuthParams(req);
    codeService.getCodes(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/codes', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var authParams = jwt.getAuthParams(req);
    codeService.getCodes(authParams, pageParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/codes/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    codeService.updateCode(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/codes/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    codeService.deleteCode(authParams, req.params.id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var where = null;
    var authParams = jwt.getAuthParams(req);
    userService.getUsers(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/users/:id/codes', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    req.body.UserId = req.params.id;
    userCodeService.create(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/codes/validate', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    userCodeService.validate(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/users/codes/me', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    userCodeService.findUserCodeMe(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/customers', (req, res) => {
    stripeService.createCustomer(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/customers', (req, res) => {
    stripeService.listCustomers(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/products', (req, res) => {
    stripeService.createProduct(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/products', (req, res) => {
    stripeService.listProducts().then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/prices', (req, res) => {
    stripeService.createPrice(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/prices', (req, res) => {
    stripeService.listPrices().then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/invoices', (req, res) => {
    stripeService.createInvoice(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoices', (req, res) => {
    stripeService.listInvoices().then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/invoiceItems', (req, res) => {
    stripeService.createInvoiceItem(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoiceItems', (req, res) => {
    stripeService.listInvoiceItems().then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/paymentSecret/me', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.createPaymentSecret(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/paymentMethod/me', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getPaymentMethodMe(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/setupIntents', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getSetupIntents(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
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

app.get('/stripe/invoices/:id', (req, res) => {
    stripeService.getInvoice(req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/invoices/:id/finalize', (req, res) => {
    stripeService.finalizeInvoice(req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/invoices/:id/pay', (req, res) => {
    stripeService.payInvoice(req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


sqsApp.on('error', (err) => {
    console.log(err);
});
sqsApp.on('processing_error', (err) => {
    console.log(err);
});
sqsApp.start();
app.listen(PORT, HOST);
