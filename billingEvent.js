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
                    where: where,
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
                 ret = utilities.notAuthorized();
                 reject(ret);
            }
        }).catch(function(err){
            reject(err);
        });
    })
}

exports.getBillingEventsMe = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            where.owner =  jwtResult["cognito:username"];
            models.BillingEvent.findAndCountAll({
                where: where,
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


exports.getAllBillingEvents = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingEvent.findAndCountAll({
                    where: where,
                    limit: pageParams.limit,
                    offset: pageParams.offset
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
                 ret = utilities.notAuthorized();
                 reject(ret);
            }
        }).catch(function(err){
            reject(err);
        });
    })
}

exports.createAuthenticated = function(authParams, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingEvent.create(body).then(function(result){
                    resolve(result);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                 ret = utilities.notAuthorized();
                 reject(ret);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getBillingEvent = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingEvent.findOne({
                    where: {id: id},
                    //attributes: ['id', 'start', 'end']
                }).then(function(billingEvent){
                    resolve(billingEvent);
                }).catch(function(err){
                    reject(err);
                });
            } else {
                ret = utilities.notAuthorized();
                reject(ret);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.deleteBillingEvent = function(authParams, id, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.BillingEvent.destroy({
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
                reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

