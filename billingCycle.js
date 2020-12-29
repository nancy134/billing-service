const models = require("./models");
const jwt = require("./jwt");

function notAuthorizedResponse(){
    ret = {
        statusCode: 400,
        message: "You are not authorized to perform this operation"
    };
    return ret;
}

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
                ret = notAuthorizedResponse();
                reject(err);
            }
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getBillingCycles = function(authParams, page, limit, offset, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            models.BillingCycle.findAndCountAll({
                where: where,
                limit: limit,
                offset: offset,
                attributes: ['id', 'start', 'end']
            }).then(function(result){
                var ret = {
                    page: page,
                    perPage: limit,
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



