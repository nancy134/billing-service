const braintree = require('braintree');

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

function getClientToken(){
    return new Promise(function(resolve, reject){
        gateway.clientToken.generate({}).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

function findCustomer(customerId){
    console.log("customerId; "+customerId);
    return new Promise(function(resolve, reject){
        gateway.customer.find(customerId).then(function(result){
            console.log(result);
            resolve(result);
        }).catch(function(err){
            console.log(err);
            reject(err);
        });
    });
}

exports.getClientToken = getClientToken;
exports.findCustomer = findCustomer;
