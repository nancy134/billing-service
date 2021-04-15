const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");

exports.create = function(authParams, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                var code = utilities.makeid(6);
                body.code = code;
                models.Code.findOrCreate({
                    where: body,
                    transaction: t
                }).then(function(result){
                    var code = result[0].get({plain: true});
                    resolve(code);
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

exports.getCodes = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Code.findAndCountAll({
                    where: where,
                    limit: pageParams.limit,
                    offset: pageParams.offset,
                    raw: true,
                    attributes: ['id', 'description','code','PromotionId'],
                    include: [
                        {
                            model: models.User,
                            as: 'user',
                            attributes: ['email', 'cognitoId']
                        },
                        {
                            model: models.Promotion,
                            attributes: ['name', 'description']
                        }
                    ]
                }).then(function(result){
                    var ret = {
                        page: pageParams.page,
                        perPage: pageParams.limit,
                        codes: result
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

exports.getAllCodes = function(authParams, pageParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Code.findAndCountAll({
                    limit: pageParams.limit,
                    offset: pageParams.offset,
                    attributes: ['id', 'description','code','PromotionId']
                }).then(function(result){
                    var ret = {
                        page: pageParams.page,
                        perPage: pageParams.limit,
                        codes: result
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

exports.updateCode = function(authParams, id, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Code.update(
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

exports.deleteCode = function(authParams, id, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Code.destroy({
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
