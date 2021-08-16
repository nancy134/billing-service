const userService = require('./user');
const jwt = require('./jwt');

const stripe = require('stripe')(process.env.STRIPE_SK);

exports.createCustomer = function(params){
    return new Promise(function(resolve, reject){
        stripe.customers.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listCustomers = function(params){
    return new Promise(function(resolve, reject){
        stripe.customers.list(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.deleteCustomer = function(id){
    return new Promise(function(resolve, reject){
        stripe.customers.del(id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createProduct = function(params){
    return new Promise(function(resolve, reject){
        stripe.products.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listProducts = function(){
    return new Promise(function(resolve, reject){
        stripe.products.list({}).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPrice = function(params){
    return new Promise(function(resolve, reject){
        stripe.prices.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listPrices = function(){
    return new Promise(function(resolve, reject){
        stripe.prices.list({}).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createInvoice = function(params){
    return new Promise(function(resolve, reject){
        stripe.invoices.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listInvoices = function(){
    return new Promise(function(resolve, reject){
        stripe.invoices.list({}).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        }); 
    });
}

exports.createInvoiceItem = function(params){
    return new Promise(function(resolve, reject){
        stripe.invoiceItems.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listInvoiceItems = function(params){
    return new Promise(function(resolve, reject){
        stripe.invoiceItems.list().then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPaymentMethods = function(params){
    return new Promise(function(resolve, reject){
        stripe.paymentMethods.list(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createIntent = function(params){
    return new Promise(function(resolve, reject){
        stripe.setupIntents.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getIntent = function(params){
    return new Promise(function(resolve, reject){
        stripe.setupIntents.retrieve(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getSetupIntents = function(){
    return new Promise(function(resolve, reject){
        stripe.setupIntents.list({}).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getSetupIntentMe = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            userService.findByCognitoId(jwtResult['cognito:username']).then(function(user){
                var body = {
                    client_secret: user.paymentSecret
                }; 
                exports.getIntent(body).then(function(intent){
                    resolve(intent);
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}
exports.getPaymentMethodMe = function(authParams){
    // 1. Get user by authParams getUserMe
    // 2. Get customer by user.email.  Should have payment method attached
    console.log("getPaymemtMethodMe");
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            userService.getUserMe(authParams).then(function(user){
                console.log(user);
                var customerParams = {
                    email: user.email
                };
                exports.listCustomers(customerParams).then(function(customer){
                    console.log("customer:");
                    console.log(customer);
                    var payParams = {
                        customer: customer.data[0].id,
                        type: 'card'
                    };
                    console.log("payParams:");
                    console.log(payParams);
                    exports.getPaymentMethods(payParams).then(function(paymentMethods){
                        resolve(paymentMethods);
                    }).catch(function(err){
                        reject(err);
                    });
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPaymentSecret = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            // 1. find user via cognitoId       
            userService.findByCognitoId(jwtResult['cognito:username']).then(function(user){
                // 2. find customer via user email 
                exports.listCustomers({email:user.email}).then(function(customer){
                    // 3. If customer found, create customer intent
                    if (customer.data.length > 0){
                        exports.createIntent({
                            customer: customer.id
                        }).then(function(intent){
                            var body = {
                                paymentSecret: intent.client_secret
                            };
                            userService.updateUserMe(authParams, body).then(function(user){
                                resolve(intent);
                            }).catch(function(err){
                                reject(err);
                            });
                        }).catch(function(err){
                            reject(err);
                        });
                    // 4. If customer not found, create customer & intent
                    } else {
                        exports.createCustomer({email: user.email}).then(function(customer){
                            exports.createIntent({
                                customer: customer.id
                            }).then(function(intent){
                                var body = {
                                    paymentSecret: intent.client_secret
                                };
                                userService.updateUserMe(authParams, body).then(function(user){
                                    resolve(intent);
                                }).catch(function(err){
                                    reject(err);
                                });
                                resolve(intent);
                            }).catch(function(err){
                                reject(err);
                            });
                        }).catch(function(err){
                            reject(err);
                        });
                    }
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}
