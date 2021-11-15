const userService = require('./user');
const jwt = require('./jwt');

const stripe = require('stripe')(process.env.STRIPE_SK);
const utilities = require("./utilities");
const productService = require("./product");


exports.createCustomer = function(params){
    return new Promise(function(resolve, reject){
        stripe.customers.create(params).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}



//exports.listCustomers = function(params){
exports.listCustomers = function(authParams, params){
        return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){

                stripe.customers.list(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.deleteCustomer = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                stripe.customers.del(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
             } else {
                reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            reject(err);
        });
   });
}

exports.createProduct = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.products.create(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}


exports.listProducts = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){

                stripe.products.list(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPrice = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.prices.create(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}


exports.listPrices = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){

                stripe.prices.list(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createInvoice = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.create(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listInvoices = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){

                stripe.invoices.list(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createInvoiceItem = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoiceItems.create(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listInvoiceItems = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){

                stripe.invoiceItems.list(params).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
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

exports.getInvoice = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.retrieve(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}


exports.finalizeInvoice = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.finalizeInvoice(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.payInvoice = function(authParams, id, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.pay(id, body).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.listLineItems = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.listLineItems(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUpcomingInvoices = function(authParams, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.retrieveUpcoming(body).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUpcomingLineItems = function(authParams, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                stripe.invoices.listUpcomingLineItems(body).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
               
        }).catch(function(err){
            reject(err);
        });
    });
}


// params = { id: 1, daysInMonth: 28, dayOnMarket: 2, price: 86}
// productParams = { name: "28 day month, 2 days on market"}
// pridceParams = { product: productId, unit_amount: 86, currency: "usd"}
exports.syncProduct = function(authParams, params){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                var productName =
                    "murban " +
                    params.daysInMonth +
                    " day month, " +
                    params.dayOnMarket +
                    " day(s) on market";
                var productParams = {
                    name: productName
                };
                exports.createProduct(authParams, productParams).then(function(product){
                    var priceParams = {
                        product: product.id,
                        unit_amount: params.price,
                        currency: "usd"
                    };
                    exports.createPrice(authParams, priceParams).then(function(price){
                        var productBody = {
                            stripeProduct: product.id,
                            stripePrice: price.id
                        }
                        productService.updateProduct(authParams, params.id, productBody).then(function(result){
                            resolve(result);
                        }).catch(function(err){
                            reject(err);
                        });
                    }).catch(function(err){
                        console.log(err);
                        reject(err);
                    });
                }).catch(function(err){
                    console.log(err);
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            console.log(err);
            reject(err);
        });
    });
}


exports.getCustomer = function(authParams, id){
    return new Promise(function(resolve, reject){
    jwt.verifyToken(authParams).then(function(jwtResult){
         if (jwt.isAdmin(jwtResult)){

            stripe.customers.retrieve(id).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        } else {
            reject(utilities.notAuthorized());
        }

    }).catch(function(err){
        reject(err);
    });
});
}

exports.updateCustomer = function(authParams, id, body){
    return new Promise(function(resolve, reject){
    jwt.verifyToken(authParams).then(function(jwtResult){
         if (jwt.isAdmin(jwtResult)){

            stripe.customers.update(id, body).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        } else {
            reject(utilities.notAuthorized());
        }

    }).catch(function(err){
        reject(err);
    });
});
}

exports.getProduct = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){

                stripe.products.retrieve(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }

        }).catch(function(err){
            reject(err);
        });
    });
}


exports.updateProduct = function(authParams, id, body){
    return new Promise(function(resolve, reject){
    jwt.verifyToken(authParams).then(function(jwtResult){
         if (jwt.isAdmin(jwtResult)){

            stripe.products.update(id, body).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        } else {
            reject(utilities.notAuthorized());
        }

    }).catch(function(err){
        reject(err);
    });
});
}

exports.deleteProduct = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                stripe.products.del(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
             } else {
                reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            reject(err);
        });
   });
}


exports.getPrice = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){

                stripe.prices.retrieve(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }

        }).catch(function(err){
            reject(err);
        });
    });
}

exports.updatePrice = function(authParams, id, body){
    return new Promise(function(resolve, reject){
    jwt.verifyToken(authParams).then(function(jwtResult){
         if (jwt.isAdmin(jwtResult)){

            stripe.prices.update(id, body).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        } else {
            reject(utilities.notAuthorized());
        }

    }).catch(function(err){
        reject(err);
    });
});
}


exports.getInvoiceItem = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){

                stripe.invoiceItems.retrieve(id).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorized());
            }

        }).catch(function(err){
            reject(err);
        });
    });
}


exports.updateInvoiceItem = function(authParams, id, body){
    return new Promise(function(resolve, reject){
    jwt.verifyToken(authParams).then(function(jwtResult){
         if (jwt.isAdmin(jwtResult)){

            stripe.invoiceItems.update(id, body).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        } else {
            reject(utilities.notAuthorized());
        }

    }).catch(function(err){
        reject(err);
    });
});
}
