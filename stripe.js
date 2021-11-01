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
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            var cognitoId = jwtResult['cognito:username']; 
            userService.getUserMe(authParams).then(function(user){
                var customerParams = {
                    email: user.email
                };
                exports.listCustomers(customerParams).then(function(customers){
                    var found = false;
                    for (var i=0; i<customers.data.length; i++){
                        if (customers.data[i].metadata.cognitoId === cognitoId){
                            var found = true;
                            var payParams = {
                                customer: customers.data[i].id,
                                type: 'card'
                            };
                            exports.getPaymentMethods(payParams).then(function(paymentMethods){
                                resolve(paymentMethods);
                            }).catch(function(err){
                                reject(err);
                           });
                       }
                    }
                    if (!found){
                        var ret = {
                            statusCode: 400,
                            message: "customer not found"
                        };
                        reject(ret);
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

exports.createCustomerAndIntent = function(authParams, customerBody){
    return new Promise(function(resolve, reject){
        exports.createCustomer(customerBody).then(function(customer){
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
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPaymentSecret = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            // 1. find user via cognitoId 
            var cognitoId = jwtResult['cognito:username']; 
            userService.findByCognitoId(jwtResult['cognito:username']).then(function(user){
                // 2. find customer via user email 
                exports.listCustomers({email:user.email}).then(function(customers){
                    // 3. If customer found, create customer intent
                    if (customers.data.length > 0){
                        var found = false; 
                        for (var i=0; i<customers.data.length; i++){
                            if (customers.data[i].metadata.cognitoId === cognitoId){
                                var found = true;
                                exports.createIntent({
                                    customer: customers.data[i].id
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
                            }
                        }
                        // If customer not found, create both customer and intent
                        if (!found){
                            var customerBody = {
                                email: user.email,
                                metadata: {
                                    cognitoId: cognitoId
                                }
                            };
                            exports.createCustomerAndIntent(authParams, customerBody).then(function(intent){
                                resolve(intent);
                            }).catch(function(err){
                                reject(err);
                            });
                        }
                    // 4. If customer not found, create customer & intent
                    } else {
                        var customerBody = {
                            email: user.email,
                            metadata: {
                                cognitoId: cognitoId
                            }
                        };
                        exports.createCustomerAndIntent(authParams, customerBody).then(function(intent){
                            resolve(intent);
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

exports.getInvoice = function(id){
    return new Promise(function(resolve, reject){
        stripe.invoices.retrieve(id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}


exports.finalizeInvoice = function(id){
    return new Promise(function(resolve, reject){
        stripe.invoices.finalizeInvoice(id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.payInvoice = function(id, body){
    return new Promise(function(resolve, reject){
        stripe.invoices.pay(id, body).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listLineItems = function(id){
    return new Promise(function(resolve, reject){
        stripe.invoices.listLineItems(id).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUpcomingInvoices = function(body){
    return new Promise(function(resolve, reject){
        stripe.invoices.retrieveUpcoming(body).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUpcomingLineItems = function(body){
    return new Promise(function(resolve, reject){
        stripe.invoices.listUpcomingLineItems(body).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}
