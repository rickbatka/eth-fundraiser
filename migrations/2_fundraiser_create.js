var UtilLib = artifacts.require("./ArrayUtil.sol");
var Fundraiser = artifacts.require("./Fundraiser.sol");

module.exports = async function(deployer) {
  await deployer.deploy(UtilLib);
  await deployer.link(UtilLib, Fundraiser);
  await deployer.deploy(Fundraiser);
  
  //var a = Fundraiser.new("Created from deployer", 1e10, {value: 1});
  //deployer.deploy(Fundraiser.new("Created from deployer", 1e10).value(1), {gas: 6721975, value: 1});
  //deployer.deploy(a, {gas: 6721975, value: 1});
};
