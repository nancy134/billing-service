const models = require("./models");

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


