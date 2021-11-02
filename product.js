const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");



exports.createProduct = function(authParams, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                 models.Product.create(body).then(function(result){
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



exports.getProducts = function(authParams, pageParams, where){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
             if (jwt.isAdmin(jwtResult)){
                 models.Product.findAndCountAll({
                    where: where,
                    limit: pageParams.limit,
                    offset: pageParams.offset
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