const braintree = require('braintree');
const jwt = require("./jwt");

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

exports.getClientToken = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            gateway.clientToken.generate({customerId: jwtResult["cognito:username"]}).then(function(result){
                if (result.success){
                    resolve(result);
                } else {
                    gateway.clientToken.generate({}).then(function(result){
                        if (result.success){
                            resolve(result);
                        } else {
                            reject(result);
                        }
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
    });
}

exports.findCustomer = function(customerId){
    return new Promise(function(resolve, reject){
        gateway.customer.find(customerId).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getPaymentMethod = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             module.exports.findCustomer(jwtResult["cognito:username"]).then(function(custResult){
                 resolve(custResult);
             }).catch(function(err){
                 if (err.type === "notFoundError"){
                     var retErr = {
                         statusCode: 400,
                         errorCode: "notFoundError"
                     };
                     reject(retErr);
                 } else {
                     reject(err);
                 }
             });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.createPaymentMethod = function(authParams, customerData){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            module.exports.findCustomer(jwtResult["cognito:username"]).then(function(customerResult){
                resolve(customerResult);
            }).catch(function(err){
                if (err.type === "notFoundError"){
                    var custData = {
                        id: jwtResult["cognito:username"],
                        email: jwtResult.email,
                        paymentMethodNonce: customerData.nonce
                    };
                    gateway.customer.create(custData).then(function(result){
                        resolve(result);
                    }).catch(function(err){
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

