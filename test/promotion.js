var SequelizeMock = require('sequelize-mock')
var { stub } = require('sinon');
var dbMock = new SequelizeMock();
var proxyquire = require('proxyquire');
const { makeMockModels } = require('sequelize-test-helpers');

describe("create: 1. valid token, is Admin, findOrCreate success", function(){
    var PromotionMock = dbMock.define('Promotion');
    var models = {
        Promotion: PromotionMock
    };

    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };
    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": models,
        "./jwt": mockJwt
    });

    it("createPromotion", function(done){
        promotionModule.create({name:"No CC, 4 mos"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });

});

describe("create: 2. valid token, is Admin, findOrCreate err", function(){
    var Promotion = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    before(() => {
        mockModels.Promotion.findOrCreate.rejects("err");
    });

    it("createPromotion", function(done){
        promotionModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 3. valid token, is not Admin", function(){
    var Promotion = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("createPromotion", function(done){
        promotionModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 4. invalid token", function(){
    var Promotion = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("createPromotion", function(done){
        promotionModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getPromotions: 1. valid token, is Admin, findAndCountAll success", function(){
    var Promotion = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Promotion.findAndCountAll.resolves({});
    });

    it("getPromotions", function(done){
        promotionModule.getPromotions(null, {}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getPromotions: 2. valid token, is Admin, findAndCountAll err", function(){
    var Promotion = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Promotion.findAndCountAll.rejects("err");
    });

    it("getPromotions", function(done){
        promotionModule.getPromotions({},{}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getPromotions: 3. valid token, is not Admin", function(){
    var Promotion = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("getPromotions", function(done){
        promotionModule.getPromotions(null, {}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getPromotions: 4. invalid token", function(){
    var Promotion = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("getPromotions", function(done){
        promotionModule.getPromotions(null, {}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updatePromotion: 1. valid token, is Admin, update success", function(){
    var Promotion = {
        update: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Promotion.update.resolves({});
    });

    it("updatePromotion", function(done){
        promotionModule.updatePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updatePromotion: 5. valid token, is Admin, update success", function(){
    var Promotion = {
        update: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        var array = [["test"]];
        mockModels.Promotion.update.resolves(array);
    });

    it("updatePromotion", function(done){
        promotionModule.updatePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updatePromotion: 2. valid token, is Admin, update err", function(){
    var Promotion = {
        update: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Promotion.update.rejects("err");
    });

    it("updatePromotion", function(done){
        promotionModule.updatePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updatePromotion: 3. valid token, is not Admin", function(){
    var Promotion = {
        update: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("updatePromotion", function(done){
        promotionModule.updatePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updatePromotion: 4. invalid token", function(){
    var Promotion = {
        update: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("updatePromotion", function(done){
        promotionModule.updatePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deletePromotion: 1. valid token, is Admin, destroy success", function(){
    var Promotion = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Promotion.destroy.resolves({});
    });

    it("deletePromotion", function(done){
        promotionModule.deletePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deletePromotion: 2. valid token, is Admin, destroy err", function(){
    var Promotion = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result["cognito:groups"] = ["Admin"];
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Promotion.destroy.rejects("err");
    });

    it("deletePromotion", function(done){
        promotionModule.deletePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deletePromotion: 3. valid token, is not Admin", function(){
    var Promotion = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("deletePromotion", function(done){
        promotionModule.deletePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deletePromotion: 4. invalid token", function(){
    var Promotion = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Promotion });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var promotionModule = proxyquire("../promotion", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("updatePromotion", function(done){
        promotionModule.deletePromotion().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

