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
const productService = require('./product');

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
    var authParams = jwt.getAuthParams(req);
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
    console.log(req.body);
    codeService.create(authParams, req.body).then(function(result){
        console.log(result);
        res.send(result);
    }).catch(function(err){
        console.log(err);
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
        console.log(err);
        errorResponse(res, err);
    });
});

app.get('/users/codes/me', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    userCodeService.findUserCodeMe(authParams).then(function(result){
        console.log(result);
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});

app.post('/stripe/customers', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.createCustomer(req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/customers', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.listCustomers(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/products', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.createProduct(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


//app.get('/stripe/products', (req, res) => {
//    var authParams = jwt.getAuthParams(req);
//    stripeService.listProducts().then(function(result){
//        res.send(result);
//    }).catch(function(err){
//        errorResponse(res, err);
//    });
//});

app.get('/stripe/products', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.listProducts(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.post('/stripe/prices', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.createPrice(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.get('/stripe/prices', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.listPrices(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.post('/stripe/invoices', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.createInvoice(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoices', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.listInvoices(authParams).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/invoiceItems', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.createInvoiceItem(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.get('/stripe/invoiceItems', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.listInvoiceItems(authParams).then(function(result){
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
            /// Find promo code
            if (json2.promoCode){
                codeService.findByPromoCodeSystem(json2.promoCode).then(function(code){ 
                    if (code){
                        var promoBody = {
                            UserId: result.id,
                            CodeId: code.id
                        }
                        userCodeService.create(body).then(function(userCode){
                        }).catch(function(err){
                        });
                    }
                }).catch(function(err){
                });
            }
        }).catch(function(err){
        });
    },
    sqs: new AWS.SQS()
});

app.get('/stripe/invoices/upcoming', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getUpcomingInvoices(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoices/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getInvoice(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/stripe/invoices/:id/finalize', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.finalizeInvoice(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.post('/stripe/invoices/:id/pay', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.payInvoice(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoices/upcoming/lines', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getUpcomingLineItems(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoices/:id/lines', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.listLineItems(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/products', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.createProduct(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/products', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    var pageParams = utilities.getPageParams(req);
    var where = null;
    productService.getProducts(authParams, pageParams, where).then(function(result){
        res.send(result);


        
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});

app.post('/products/import', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.importProducts(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.delete('/products/all', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.deleteAllProducts(authParams).then(function(result){
        res.send("OK");
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/products/sync', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.syncProducts(authParams, req.body).then(function(result){
    res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.delete('/products/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.deleteProduct(authParams, req.params.id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/products/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.updateProduct(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.get('/products/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    productService.getProduct(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingEvents', (req, res) => {
    var pageParams = utilities.getPageParams(req);
    var where = null;
    var authParams = jwt.getAuthParams(req);
    billingEventService.getAllBillingEvents(authParams, pageParams, where).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});


app.post('/products/:id/sync', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    //productService.syncProduct(authParams, id).then(function(result){
    productService.syncProduct(authParams, req.params.id).then(function(result){
    res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


//app.post('/billingEvents', (req, res) => {
//    var authParams = jwt.getAuthParams(req);
//    billingEventService.create(authParams, req.body).then(function(result){
//        res.send(result);
//    }).catch(function(err){
//        errorResponse(res, err);
//    });
//});


app.post('/billingEvents', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    billingEventService.createAuthenticated(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/billingEvents/:id', (req, res) => {
    var id = req.params.id;
    var authParams = jwt.getAuthParams(req);
    billingEventService.getBillingEvent(authParams, id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.delete('/billingEvents/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    billingEventService.deleteBillingEvent(authParams, req.params.id).then(function(result){
        res.send("ok");
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.post('/billingEvents/sqs', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    var pageParams = utilities.getPageParams(req);
    
    var daysOnMarket = utilities.getDaysOnMarket(req.body.start, req.body.end);
    var daysInMonth = utilities.getDaysInMonth(req.body.end);
    var where = {
        dayOnMarket: daysOnMarket,
        daysInMonth: daysInMonth
    };
    productService.getProducts(authParams, pageParams, where).then(function(products){
        var body = {
            BillingCycleId: req.body.BillingCycleId,
            start: req.body.start,
            end: req.body.end,
            ListingId: req.body.ListingId,
            owner: req.body.owner,
            ProductId: products.products.rows[0].id
        }
        billingEventService.create(body).then(function(billingEvent){
            res.send(billingEvent);
        }).catch(function(err){
            errorResponse(res, err);
        });
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.post('/billingEvents/:id/invoice', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    billingEventService.invoice(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err);
        errorResponse(res, err);
    });
});


app.get('/stripe/customers/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getCustomer(authParams, req.params.id).then(function(result){
    //stripeService.getCustomer(req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.delete('/stripe/customers/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.deleteCustomer(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.put('/stripe/customers/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.updateCustomer(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.get('/stripe/products/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getProduct(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.put('/stripe/products/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.updateProduct(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.delete('/stripe/products/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.deleteProduct(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/prices/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getPrice(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.put('/stripe/prices/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.updatePrice(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/invoiceItems/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getInvoiceItem(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.put('/stripe/invoiceItems/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.updateInvoiceItem(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.get('/stripe/payment_methods', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getPaymentMethodsMe(authParams, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});

app.get('/stripe/payment_methods/:id', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getPaymentMethod(authParams, req.params.id).then(function(result){
        res.send(result);
    }).catch(function(err){
        errorResponse(res, err);
    });
});


app.get('/stripe/customers/:id/payment_methods', (req, res) => {
    var authParams = jwt.getAuthParams(req);
    stripeService.getCustomerPaymentMethods(authParams, req.params.id, req.body).then(function(result){
        res.send(result);
    }).catch(function(err){
        console.log(err)
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
