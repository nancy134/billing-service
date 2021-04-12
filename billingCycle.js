const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");

exports.create = function(authParms, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingCycle.create(body).then(function(result){
                    resolve(result);
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
    });
}

exports.getBillingCycles = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            models.BillingCycle.findAndCountAll({
                where: where,
                limit: pageParams.limit,
                offset: pageParams.offset,
                attributes: ['id', 'start', 'end', 'startDate', 'endDate']
            }).then(function(result){
                var ret = {
                    page: pageParams.page,
                    perPage: pageParams.limit,
                    billingCycles: result
                };
                resolve(ret);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getBillingCycle = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingCycle.findOne({
                    where: {id: id},
                    attributes: ['id', 'start', 'end']
                }).then(function(billingCycle){
                    resolve(billingCycle);
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
    });
}

exports.deleteBillingCycle = function(authParams, id, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingCycle.destroy({
                    where: {
                        id: id,
                    },
                    transaction: t
                }).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                reject(utilities.notAuthorizedResponse());
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

