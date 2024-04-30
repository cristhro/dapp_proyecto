//var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var UserManagment = artifacts.require("./UserManagment.sol");
var donation = artifacts.require("./Donation.sol");
var projectManagement = artifacts.require("./ProjectManagement");

module.exports = function(deployer) {
  //deployer.deploy(SimpleStorage);
deployer.deploy(UserManagment);
deployer.deploy(donation);
deployer.deploy(projectManagement);
};
