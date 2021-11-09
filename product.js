const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");
const stripeService = require("./stripe");
const PromiseThrottle = require("promise-throttle");

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

exports.deleteAllProducts = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Product.destroy({
                    where: {},
                    truncate: true
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

exports.updateProduct = function(authParams, id, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Product.update(
                    body,
                    {
                        returning: true,
                        where: {id: id},
                        transaction: t
                    }
                ).then(function([rowsUpdate, [product]]){
                    resolve(product);
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

exports.getProduct = function(authParams, id){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Product.findOne({
                    where: {id: id}
                }).then(function(product){
                    resolve(product);
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

//exports.syncProducts = function(authParams, body){
//   return new Promise(function(resolve, reject){
//        jwt.verifyToken(authParams).then(function(jwtResult){
//             if (jwt.isAdmin(jwtResult)){
//                 resolve("sync products");
//             } else {
//                reject(utilities.notAuthorized());
//            }
//
//        }).catch(function(err){
//            reject(err);
//        });
//   });
//}


// params = { id: 1, daysInMonth: 28, dayOnMarket: 2, price: 86}
// productParams = { name: "28 day month, 2 days on market"}
// pridceParams = { product: productId, unit_amount: 86, currency: "usd"}
exports.syncProducts = function(authParams, body){
    
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            if (jwt.isAdmin(jwtResult)){
                models.Product.findAndCountAll({}).then(function(result){
                    if (result.rows.length > 0){
                    
                        var promiseThrottle = new PromiseThrottle({
                            requestsPerSecond: 20,
                            //promiseImplementation: Promise
                        });
                        var syncProductPromises = [];                    
                        for (var i=0; i<result.rows.length; i++){
                            //var syncProduct = promiseThrottle.add(stripeService.syncProduct(authParams,result.rows[i]));
                            var syncProduct = promiseThrottle.add(stripeService.syncProduct.bind(this, authParams,result.rows[i]));
                            syncProductPromises.push(syncProduct);
                        }
                        Promise.all(syncProductPromises).then(function(result){
                            resolve(result);
                        }).catch(function(err){
                            console.log(err);
                            reject(err);
                        });
                    } else {
                        resolve("no products");
                    }
                }).catch(function(err){
                     console.log(err);
                     reject(err);
                });
            } else {
               reject(utilities.notAuthorized());
            }
        }).catch(function(err){
            console.log(err);
            reject(err);
        });
   });
}
