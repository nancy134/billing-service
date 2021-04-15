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
            },
            attributes: ['id', 'cognitoId', 'email']
        }).then(function(user){
            resolve(user);
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

