const braintree = require('braintree');
const jwt = require("./jwt");

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

function getClientToken(IdToken, cognitoClientId, cognitoPoolId){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(
            IdToken,
            cognitoClientId,
            cognitoPoolId
        ).then(function(jwtResult){
            gateway.clientToken.generate({customerId: jwtResult["cognito:username"]}).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

function findCustomer(customerId){
    return new Promise(function(resolve, reject){
        gateway.customer.find(customerId).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

function getPaymentMethod(IdToken, cognitoClientId, cognitoPoolId){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(
            IdToken,
            cognitoClientId,
            cognitoPoolId
        ).then(function(jwtResult){
             findCustomer(jwtResult["cognito:username"]).then(function(custResult){
                 resolve(custResult);
             }).catch(function(err){
                 reject(err);
             });
        }).catch(function(err){
            reject(err);
        });
    });
}

function createPaymentMethod(IdToken, customerData){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(
            IdToken,
            customerData.cognitoClientId,
            customerData.cognitoPoolId
        ).then(function(result){
            var custData = {
                id: result["cognito:username"],
                email: result.email,
                paymentMethodNonce: customerData.nonce
            };
            gateway.customer.create(custData).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getClientToken = getClientToken;
exports.findCustomer = findCustomer;
exports.createPaymentMethod = createPaymentMethod;
exports.getPaymentMethod = getPaymentMethod;
