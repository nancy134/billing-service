const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");

exports.create = function(authParams, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Code.findOrCreate({
                }).then(function(result){
                    var code = result[0].get({plain: true});
                    resolve(code);
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

