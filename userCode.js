const models = require("./models");
const jwt = require("./jwt");
const utilities = require("./utilities");
const userService = require("./user");
const codeService = require("./code");

exports.create = function(authParams, body, t){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            models.UserCode.findOrCreate({
                where: body,
                transaction: t
            }).then(function(result){
                var code = result[0].get({plain: true});
                resolve(code);
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.findByCode = function(authParams, codeId){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            models.UserCode.findOne({
                where: {
                    CodeId: codeId
                }
            }).then(function(result){
                resolve(result);
            }).catch(function(err){
                reject(err);
            });                
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.findUserCodeMe = function(authParams){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            var cognitoId = jwtResult["cognito:username"];
            userService.findByCognitoId(cognitoId).then(function(user){
                if (user){
                    models.UserCode.findOne({
                        where: {
                            UserId: user.id
                        },
                        attributes: [
                            'id',
                            'UserId',
                            'CodeId',
                            'createdAt'
                        ],
                        include: [
                            {
                                model: models.User,
                                attributes: ['id', 'email']
                            },{
                                model: models.Code,
                                attributes: ['id', 'code','PromotionId'],
                                include: [
                                    {
                                        model: models.Promotion,
                                        attributes: ['id','name','description']
                                    }
                                ]
                            }
                        ]
                    }).then(function(result){
                        resolve(result);
                    }).catch(function(err){
                        reject(err);
                    });
                } else {
                    var body = {
                        statusCode: 400,
                        message: "User not found"
                    };
                    reject(body);
                }
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

exports.validate = function(authParams, body){
    return new Promise(function(resolve, reject){
        jwt.verifyToken(authParams).then(function(jwtResult){
            var cognitoId = jwtResult["cognito:username"];
            userService.findByCognitoId(cognitoId).then(function(user){
                codeService.findByPromoCode(authParams, body.code).then(function(code){
                    console.log("code:");
                    console.log(code);
                    if (code !== null){

                        // If promotion is multi-use, then create
                        // If promotion is single-use, then only create if not already in use:w

                        exports.findByCode(authParams, code.id).then(function(userCode){
                            console.log("userCode:");
                            console.log(userCode);
                            if (!userCode || (userCode && code.multiUse === true)){
                                var body = {
                                    UserId: user.id,
                                    CodeId: code.id
                                };
                                console.log("body:");
                                console.log(body);
                                exports.create(authParams, body).then(function(userCode){
                                    exports.findUserCodeMe(authParams).then(function(userCodeFull){
                                        console.log("userCodeFull:");
                                        console.log(userCodeFull);
                                        resolve(userCodeFull);
                                    }).catch(function(err){
                                        reject(err);
                                    });
                                }).catch(function(err){
                                    reject(err);
                                });
                            } else {
                                var msg = {
                                    statusCode: 400,
                                    message: "Promotion code in use"
                                }
                                reject(msg);
                            }
                        }).catch(function(err){
                            reject(err);
                        });
                    } else {
                        var msg = {
                            statusCode: 400,
                            message: "Invalid promotion code"
                        }
                        reject(msg);
                    }
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        }).catch(function(err){
            reject(err);
        });
    });
}

