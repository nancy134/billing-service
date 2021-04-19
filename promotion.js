const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");

exports.create = function(authParams, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Promotion.create(body)
                .then(function(promotion){
                    resolve(promotion);
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

exports.getPromotions = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Promotion.findAndCountAll({
                    where: where,
                    limit: pageParams.limit,
                    offset: pageParams.offset,
                    attributes: ['id', 'name', 'description']
                }).then(function(result){
                    var ret = {
                        page: pageParams.page,
                        perPage: pageParams.limit,
                        promotions: result
                    };
                    resolve(ret);
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
exports.updatePromotion = function(authParams, id, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Promotion.update(
                    body,
                    {
                        returning: true,
                        where: {id: id}
                    }
                ).then(function(update){
                   if (!update[0]){
                       reject({message: "No records updated"});
                   } else {
                       resolve(update[1][0]);
                   }
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

exports.deletePromotion = function(authParams, id, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Promotion.destroy({
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

