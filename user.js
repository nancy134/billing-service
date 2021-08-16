const models = require("./models");
const jwt = require('./jwt');
const utilities = require('./utilities');

exports.create = function(body, t){
    return new Promise(function(resolve, reject){
        models.User.findOrCreate({
           where: body,
           transaction: t
        }).then(function(result){
            var user = result[0].get({plain: true});
            resolve(user);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.findByCognitoId = function(cognitoId){
    return new Promise(function(resolve, reject){
        models.User.findOne({
            where: {
                cognitoId: cognitoId
            }
        }).then(function(user){
            resolve(user);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.findByEmail = function(email){
    return new Promise(function(resolve, reject){
        models.User.findOne({
            where: {
                email: email
            }
        }).then(function(user){
            resolve(user);
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUsersMe = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            models.User.findONe({
                where: {
                    cognitoId: jwtResult["cognito:username"]
                }
            }).then(function(result){
                if (result){
                    var user = result.get({plain:true});
                    resolve(user);
                } else {
                    var err = {
                        statuscode: 400,
                        message: "User not found in database"
                    };
                    resolve(err);
                }
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.getUsers = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.User.findAndCountAll({
                    where: where,
                    limit: pageParams.limit,
                    offset: pageParams.offset,
                    attributes: ['id', 'email', 'cognitoId']
                }).then(function(result){
                    var ret = {
                        page: pageParams.page,
                        perPage: pageParams.limit,
                        users: result
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

exports.getUserMe = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            var isAdmin = false;
            if (jwt.isAdmin(jwtResult)){
                isAdmin = true;
            }
            models.User.findOne({
                where: {
                    cognitoId: jwtResult["cognito:username"] 
                }
            }).then(function(result){
                if (result){
                    var user = result.get({plain:true});
                    user.isAdmin = isAdmin;
                    resolve(user);
                } else {
                    var err = {
                        statusCode: 400,
                        message: "User not found in database"
                    };
                    resolve(err);
                }
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.updateUserMe = function(authParams, body){
    return new Promise(function(resolve, reject){
        exports.getUserMe(authParams).then(function(result){
            models.User.update(
                body,
                {
                    returning: true,
                    where: {id: result.id}
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
        }).catch(function(err){
            reject(err);
        });
    });
}

