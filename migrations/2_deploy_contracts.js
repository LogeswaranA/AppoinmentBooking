var BookingSystem = artifacts.require("./BookingContract.sol");

module.exports = function(deployer){
  deployer.deploy(BookingSystem);
}
