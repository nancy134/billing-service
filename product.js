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
                     var ret = {
                         page: pageParams.page,
                         perPage: pageParams.limit,
                         products: result
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


exports.importProducts = function(authParams, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                var createPromises = [];
                if (body.products.length){
                    for (var i=0; i<body.products.length; i++){
                        console.log(body.products[i]);
                        createPromises.push(models.Product.create(body.products[i]));
                    }
                    Promise.all(createPromises).then(function(values){
                        resolve(values);
                    }).catch(function(err){
                        reject(err);
                    });
                    
                } else {
                    resolve("no products");
                }
            } else {
                reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            reject(err);
        });
   });
}


exports.deleteProduct = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Product.destroy({
                    where: {id: id,}
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

