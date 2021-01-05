const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");

exports.create = function(body){
    return new Promise(function(resolve, reject){
        models.BillingEvent.create(body).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getBillingEvents = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingEvent.findAndCountAll({
                    where: {owner: jwtResult["cognito:username"]},
                    limit: pageParams.limit,
                    offset: pageParams.offset,
                    attributes: [
                        'id',
                        'start',
                        'end',
                        'ListingId',
                        'owner',
                        'daysOnMarket',
                        'cost'
                    ]
                }).then(function(result){
                    var ret = {
                        page: pageParams.page,
                        perPage: pageParams.limit,
                        billingEvents: result
                    };
                    resolve(ret);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                 ret = utilities.notAuthorizedResponse();
                 reject(ret);
            }
        }).catch(function(err){
            reject(err);
        });
    })
}

exports.deleteBillingEvents = function(authParams, id){
    return new Promise(function(resolve, reject){
        models.BillingEvent.destroy({
            where: {
                BillingCycleId: id
            }
        }).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject(err);
        });
    });
}

