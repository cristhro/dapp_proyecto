/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

var UserManagment = artifacts.require("./UserManagment.sol");
var Donation = artifacts.require("./Donation.sol");
var ProjectManagement = artifacts.require("./ProjectManagement");

module.exports = async function (callback) {

  const userManagmentContract = await UserManagment.deployed();

  const adminUser = {
    address: '0xB351f49D330D5FEDEfE6b8AFD7a5Cf49527deF8F',
    name: 'admin',
    email: 'admin@test.com',
    tipoUsuario: 4, // 1 = student, 2 = company, 3 = instructor, 4 = admin
    imageURI: 'https://robohash.org/b6ffbeafcbfe8bf535e1fbb159a51f4a?set=set4&bgset=&size=400x400'
  }
  const studentUser = {
    address: '0xEdB89341560Fc1c9f45c2bb7Ea05954DfcD22934',
    name: 'student',
    email: 'student@test.com',
    tipoUsuario: 1, // 1 = student, 2 = company, 3 = instructor, 4 = admin
    imageURI: 'https://gravatar.com/avatar/b6ffbeafcbfe8bf535e1fbb159a51f4a?s=400&d=robohash&r=x'
  }
  const companyUser = {
    address: '0x523Ed327544A48615f89e35A19EE149be1A95CDd',
    name: 'company',
    email: 'company@test.com',
    tipoUsuario: 3, // 1 = student, 2 = company, 3 = instructor, 4 = admin
    imageURI: 'https://gravatar.com/avatar/b6ffbeafcbfe8bf535e1fbb159a51f4a?s=400&d=identicon&r=x'
  }

  const users = [adminUser, studentUser, companyUser]
  for (const user of users) {
    const { tx } = await userManagmentContract.registerUser(user.name, user.email, user.tipoUsuario, user.imageURI, { from: user.address });
    console.log(`User [${user.name}] created ${tx}`);
  }

  callback();
};
