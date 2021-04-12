var SequelizeMock = require('sequelize-mock')
var { stub } = require('sinon');
var dbMock = new SequelizeMock();
var proxyquire = require('proxyquire');
const { makeMockModels } = require('sequelize-test-helpers');

describe("create: 1. valid token, is Admin, findOrCreate success", function(){
    var BillingCycleMock = dbMock.define('BillingCycle');
    var models = {
        BillingCycle: BillingCycleMock
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

    var billingCycleModule = proxyquire("../billingCycle", {
        "./models": models,
        "./jwt": mockJwt
    });

    it("createBillingCycle", function(done){
        billingCycleModule.create({name:"No CC, 4 mos"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });

});

describe("create: 2. valid token, is Admin, findOrCreate err", function(){
    var BillingCycle = {
        findOrCreate: stub()
    }

    var mockModels = makeMockModels({ BillingCycle });
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

    var billingCycleModule = proxyquire("../billingCycle", {
        "./models": mockModels,
        "./jwt": mockJwt
    });

    before(() => {
        mockModels.BillingCycle.findOrCreate.rejects("err");
    });

    it("createBillingCycle", function(done){
        billingCycleModule.create({name: "error"}).then(function(result){
            done();
        }).catch(function(err){
            done();
        });
    });
});
