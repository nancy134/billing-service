var SequelizeMock = require('sequelize-mock')
var { stub } = require('sinon');
var dbMock = new SequelizeMock();
var proxyquire = require('proxyquire');
const { makeMockModels } = require('sequelize-test-helpers');

describe("create: 1. valid token, is Admin, findOrCreate success", function(){

    var CodeMock = dbMock.define('Code');
    var models = {
        Code: CodeMock
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

    var codeModule = proxyquire("../code", {
        "./models": models,
        "./jwt": mockJwt
    });

    it("createCode", function(done){
        codeModule.create({},{}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });

});

describe("create: 2. valid token, is Admin, findOrCreate err", function(){
    var Code = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    before(() => {
        mockModels.Code.findOrCreate.rejects("err");
    });

    it("createCode", function(done){
        codeModule.create({},{}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 3. valid token, is not Admin", function(){
    var Code = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("createCode", function(done){
        codeModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 4. invalid token", function(){
    var Code = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("createCode", function(done){
        codeModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getCodes: 1. valid token, is Admin, findAndCountAll success", function(){
    var Code = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Code.findAndCountAll.resolves({});
    });

    it("getCodes", function(done){
        codeModule.getCodes(null, {}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getCodes: 2. valid token, is Admin, findAndCountAll err", function(){
    var Code = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Code.findAndCountAll.rejects("err");
    });

    it("getCodes", function(done){
        codeModule.getCodes({},{}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getCodes: 3. valid token, is not Admin", function(){
    var Code = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("getCodes", function(done){
        codeModule.getCodes(null, {}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("getCodes: 4. invalid token", function(){
    var Code = {
        findAndCountAll: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("getCodes", function(done){
        codeModule.getCodes(null, {}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updateCode: 1. valid token, is Admin, update success", function(){
    var Code = {
        update: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Code.update.resolves({});
    });

    it("updateCode", function(done){
        codeModule.updateCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updateCode: 5. valid token, is Admin, update success", function(){
    var Code = {
        update: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        var array = [["test"]];
        mockModels.Code.update.resolves(array);
    });

    it("updateCode", function(done){
        codeModule.updateCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updateCode: 2. valid token, is Admin, update err", function(){
    var Code = {
        update: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Code.update.rejects("err");
    });

    it("updateCode", function(done){
        codeModule.updateCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updateCode: 3. valid token, is not Admin", function(){
    var Code = {
        update: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("updateCode", function(done){
        codeModule.updateCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("updateCode: 4. invalid token", function(){
    var Code = {
        update: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("updateCode", function(done){
        codeModule.updateCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deleteCode: 1. valid token, is Admin, destroy success", function(){
    var Code = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Code.destroy.resolves({});
    });

    it("deleteCode", function(done){
        codeModule.deleteCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deleteCode: 2. valid token, is Admin, destroy err", function(){
    var Code = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Code });
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

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });
    before(() => {
        mockModels.Code.destroy.rejects("err");
    });

    it("deleteCode", function(done){
        codeModule.deleteCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deleteCode: 3. valid token, is not Admin", function(){
    var Code = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("deleteCode", function(done){
        codeModule.deleteCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("deleteCode: 4. invalid token", function(){
    var Code = {
        destroy: stub()
    }

    var mockModels = makeMockModels({ Code });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var codeModule = proxyquire("../code", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("updateCode", function(done){
        codeModule.deleteCode().then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

