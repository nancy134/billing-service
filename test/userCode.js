var SequelizeMock = require('sequelize-mock')
var { stub } = require('sinon');
var dbMock = new SequelizeMock();
var proxyquire = require('proxyquire');
const { makeMockModels } = require('sequelize-test-helpers');

describe("create: 1. valid token, is Admin, findOrCreate success", function(){

    var UserCodeMock = dbMock.define('UserCode');
    var models = {
        UserCode: UserCodeMock
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

    var userCodeModule = proxyquire("../userCode", {
        "./models": models,
        "./jwt": mockJwt
    });

    it("createUserCode", function(done){
        userCodeModule.create({},{}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 2. valid token, is Admin, findOrCreate err", function(){
    var UserCode = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ UserCode });
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

    var userCodeModule = proxyquire("../userCode", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    before(() => {
        mockModels.UserCode.findOrCreate.rejects("err");
    });

    it("createUserCode", function(done){
        userCodeModule.create({},{}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 3. valid token, is not Admin", function(){
    var UserCode = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ UserCode });
    var mockJwt = {
        verifyToken: function() {
            var result = {};
            result["cognito:username"] = "fakeCognitoId";
            result.sub = "abcdef";
            return Promise.resolve(result);
        }
    };

    var proxyquire = require("proxyquire");

    var userCodeModule = proxyquire("../userCode", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("createUserCode", function(done){
        userCodeModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});

describe("create: 4. invalid token", function(){
    var UserCode = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ UserCode });
    var mockJwt = {
        verifyToken: function() {
            return Promise.reject("err");
        }
    };

    var proxyquire = require("proxyquire");

    var userCodeModule = proxyquire("../userCode", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    it("createUserCode", function(done){
        userCodeModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});
