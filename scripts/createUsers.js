/*
  Try `truffle exec scripts/increment.js`, you should `truffle migrate` first.

  Learn more about Truffle external scripts: 
  https://trufflesuite.com/docs/truffle/getting-started/writing-external-scripts
*/

var UserManagment = artifacts.require("./UserManagment.sol");
var Donation = artifacts.require("./Donation.sol");
var ProjectManagement = artifacts.require("./ProjectManagement");

module.exports = async function (callback) {

  const projectManagement = await ProjectManagement.deployed();

  const adminUser = {
    address: '0xB351f49D330D5FEDEfE6b8AFD7a5Cf49527deF8F', // TODO: change this address
    name: 'admin',
    email: 'admin@test.com',
    role: 0, // 1 = student, 2 = company, 3 = instructor, 4 = admin
    imageURI: 'https://robohash.org/b6ffbeafcbfe8bf535e1fbb159a51f4a?set=set4&bgset=&size=400x400'
  }
  const companyUser = {
    address: '0x523Ed327544A48615f89e35A19EE149be1A95CDd', // TODO: change this address
    name: 'company',
    email: 'company@test.com',
    role: 1, // 1 = student, 2 = company, 3 = instructor, 4 = admin
    imageURI: 'https://gravatar.com/avatar/b6ffbeafcbfe8bf535e1fbb159a51f4a?s=400&d=identicon&r=x'
  }
  const studentUser = {
    address: '0xEdB89341560Fc1c9f45c2bb7Ea05954DfcD22934', // TODO: change this address
    name: 'student',
    email: 'student@test.com',
    role: 2, // 1 = student, 2 = company, 3 = instructor, 4 = admin
    imageURI: 'https://gravatar.com/avatar/b6ffbeafcbfe8bf535e1fbb159a51f4a?s=400&d=robohash&r=x'
  }

  const users = [adminUser, studentUser, companyUser]
  for (const user of users) {
    const { tx } = await projectManagement.registerUser( user.name, user.email, user.role, user.imageURI, { from: user.address });
    console.log(`User [${user.name}] created ${tx}`);
  }

  callback();
};
