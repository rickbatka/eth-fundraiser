var Fundraiser = artifacts.require("./Fundraiser.sol");

module.exports = function(deployer) {
    var a = Fundraiser.new("Created from deployer", 1e10, {value: 1});
  //deployer.deploy(Fundraiser.new("Created from deployer", 1e10).value(1), {gas: 6721975, value: 1});
  //deployer.deploy(a, {gas: 6721975, value: 1});
};
