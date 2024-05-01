/* eslint-disable */

// Import React package
import React from "react";

// Import component CSS style
import "./App.css";

// Import helper functions
import getWeb3 from "../helpers/getWeb3";

// Import React components
import { RegisterUser } from './RegisterUser';
import { UserInformation } from './UserInformation';
import { DonationInformation } from './DonationInformation';
import { RegisterDonation } from './RegisterDonation';
import { RegisterProject } from "./RegisterProject";
import { ProjectList } from "./ProjectList";
import { UserList } from "./UserList";
import { CompanyUsers } from "./CompanyUsers";
import { CompanyProjects } from "./CompanyProjects";
import { StudentProjects } from "./StudentProjects";
import { ProjectInformation } from "./ProjectInformation";
import { AssignAmountToProject } from "./AssignAmountToProject";

//////////////////////////////////////////////////////////////////////////////////|
//        CONTRACT ADDRESS           &          CONTRACT ABI                      |
//////////////////////////////////////////////////////////////////////////////////|                                                             |
const USER_CONTRACT_ADDRESS = require("../contracts/UserManagment.json").networks[1337].address //1337
const USER_CONTRACT_ABI = require("../contracts/UserManagment.json").abi

const DONATION_CONTRACT_ADDRESS = require("../contracts/Donation.json").networks[1337].address
const DONATION_CONTRACT_ABI = require("../contracts/Donation.json").abi


export default class App extends React.Component {
  state = {
    web3Provider: null,
    accounts: null,
    networkId: null,
    userContract: null,
    storageValue: null,
    userForm: {}
  };

  componentDidMount = async () => {
    try {

      const web3 = await getWeb3();                   // Get network provider and web3 instance.
      const accounts = await web3.eth.getAccounts();  // Use web3 to get the user's accounts.
      const networkId = await web3.eth.net.getId();   // Get the network ID


      const userContract = new web3.eth.Contract(USER_CONTRACT_ABI, USER_CONTRACT_ADDRESS);                 // Create the Smart Contract instance
      const donationContract = new web3.eth.Contract(DONATION_CONTRACT_ABI, DONATION_CONTRACT_ADDRESS);     // Create the Smart Contract instance


      // Set web3, accounts, and userContract to the state, and then proceed with an
      // example of interacting with the userContract's methods.
      this.setState({
        web3Provider: web3, accounts, networkId, userContract, donationContract,
        donationAmount: 0,
        myDonationAmount: 0,
        projectsInfo: [],
        usersInfo: [],
        selectedProject: null
      });


      this.getUserInformation();      // Load user information
      this.getDonationInformation();  // Load donation information
      this.getMyDonationInformation(); // Load my donation information
      this.getProjects(); // Load projects
      this.getStudentProjects(); // Load users
      this.getUsers(); // Load users
      this.getProjectUsers(); // Load project users
      this.getCompanyProjects(); // Load company projects
      this.getCompanyUsers(); // Load company users

      // --------- TO LISTEN TO EVENTS AFTER EVERY COMPONENT MOUNT ---------
      this.handleMetamaskEvent();


    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or userContract. Check console for details.`,
      );
      console.error(error);
    }
  };

  // --------- METAMASK EVENTS ---------
  handleMetamaskEvent = async () => {
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log('🚀 ~ App ~ accounts:', accounts)
      // Time to reload your interface with accounts[0]!
      alert("Incoming event from Metamask: Account changed 🦊" + accounts[0])
      window.location.reload()
    })

    window.ethereum.on('chainChanged', function (networkId) {
      // Time to reload your interface with the new networkId
      alert("Incoming event from Metamask: Network changed 🦊" + networkId)
      window.location.reload()
    })
  }

  // ------------ CALL GET INFORMATION FUNCTION ------------
  getDonationInformation = async () => {
    const { donationContract } = this.state;

    // Get the users donation
    const response = await donationContract.methods.getTotalDonations().call();
    this.setState({ totalDonations: response })
  }

  // ------------ GET MY DONATION INFORMATION FUNCTION ------------
  getMyDonationInformation = async () => {
    const { donationContract, accounts } = this.state;

    // Get the user donation
    const response = await donationContract.methods.getDonationAmount(accounts[0]).call();
    this.setState({ myDonationAmount: response })
  }
  // ------------ REGISTER DONATION FUNCTION ------------
  registerDonation = async (donationAmount) => {
    const { donationContract, web3Provider, accounts } = this.state;

    try {
      await donationContract.methods.depositEther().send({ from: accounts[0], value: web3Provider.utils.toWei(donationAmount, 'ether') });
    } catch (error) {
      console.error('Error sending donation:', error);
      // setDonationMessage('Donation failed.');
    }



    const response = await donationContract.methods.getTotalDonations().call();
    this.setState({ totalDonations: response })

    // Get the user donation
    const myResponse = await donationContract.methods.getDonationAmount(accounts[0]).call();
    this.setState({ myDonationAmount: myResponse })
  }

  // --------------------------------------------------------------


  // ------------ GET  INFORMATION FUNCTION ------------
  getUserInformation = async () => {
    const { accounts, userContract } = this.state;

    // Get the user information
    const response = await userContract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  }
  getProjects = async () => {
    //const { accounts, userContract } = this.state;

    // Get the user information
    // const response = await userContract.methods.getUser().call({ from: accounts[0] });
    const projects = [
      { id: '1', name: 'Test 1', description: 'Description 1', amount: 1},
      { id: '2', name: 'Test 2', description: 'Description 2', amount: 12},
      { id: '3', name: 'Test 3', description: 'Description 3', amount: 13},
      { id: '4', name: 'Test 4', description: 'Description 4', amount: 14},
      { id: '5', name: 'Test 5', description: 'Description 5', amount: 15},
      { id: '6', name: 'Test 6', description: 'Description 6', amount: 16},
      { id: '7', name: 'Test 7', description: 'Description 7', amount: 17},
      { id: '8', name: 'Test 8', description: 'Description 8', amount: 18},
      { id: '9', name: 'Test 9', description: 'Description 9', amount: 19},
    ]
    this.setState({ projectsInfo: projects })
  }
  getCompanyProjects = async () => {
    //const { accounts, userContract } = this.state;

    // Get the user information
    // const response = await userContract.methods.getUser().call({ from: accounts[0] });
    const companyProjects = [
      { id: '1', name: 'Test 1', description: 'Description 1', status: 'Active', amount:100 },
      { id: '2', name: 'Test 2', description: 'Description 2', status: 'Pause', amount:200 },
      { id: '3', name: 'Test 3', description: 'Description 3', status: 'Active', amount:300 },
      { id: '4', name: 'Test 4', description: 'Description 4', status: 'Complete', amount:400 },
      { id: '5', name: 'Test 5', description: 'Description 5', status: 'Complete', amount:500 },
      { id: '6', name: 'Test 6', description: 'Description 6', status: 'Complete', amount:600 },
      { id: '7', name: 'Test 7', description: 'Description 7', status: 'Pause', amount:700 },
      { id: '8', name: 'Test 8', description: 'Description 8', status: 'Pause', amount:800 },
      { id: '9', name: 'Test 9', description: 'Description 9', status: 'Pause', amount:900 },
    ]
    this.setState({ companyProjectsInfo: companyProjects })
  }
  getStudentProjects = async () => {
    //const { accounts, userContract } = this.state;

    // Get the user information
    // const response = await userContract.methods.getUser().call({ from: accounts[0] });
    const studentProjects = [
      { id: '1', name: 'Project Test 1', description: 'Description 1' },
      { id: '2', name: 'Project Test 2', description: 'Description 2' },
      { id: '3', name: 'Project Test 3', description: 'Description 3' },
    ]
    this.setState({ studentProjectsInfo: studentProjects })
  }
  getUsers = async () => {
    //const { accounts, userContract } = this.state;

    // Get the user information
    // const response = await userContract.methods.getUser().call({ from: accounts[0] });
    const users = [
      { name: 'User Test 1', tipoUsuario: 1 },
      { name: 'User Test 2', tipoUsuario: 1 },
      { name: 'User Test 3', tipoUsuario: 1 },
      { name: 'User Test 4', tipoUsuario: 2 },
      { name: 'User Test 5', tipoUsuario: 2 },
      { name: 'User Test 6', tipoUsuario: 2 },
      { name: 'User Test 7', tipoUsuario: 3 },
      { name: 'User Test 8', tipoUsuario: 3 },
      { name: 'User Test 9', tipoUsuario: 3 },
    ]
    this.setState({ usersInfo: users })
  }
  getProjectUsers = async () => {
    //const { accounts, userContract } = this.state;

    // Get the user information
    // const response = await userContract.methods.getUser().call({ from: accounts[0] });
    const projectUsers = [
      { name: 'Project Test 1', tipoUsuario: 1 },
      { name: 'Project Test 2', tipoUsuario: 1 },
      { name: 'Project Test 3', tipoUsuario: 1 },
      { name: 'Project Test 4', tipoUsuario: 2 },
      { name: 'Project Test 5', tipoUsuario: 2 },
      { name: 'Project Test 6', tipoUsuario: 2 },
      { name: 'Project Test 7', tipoUsuario: 3 },
      { name: 'Project Test 8', tipoUsuario: 3 },
      { name: 'Project Test 9', tipoUsuario: 3 },
    ]
    this.setState({ projectUsersInfo: projectUsers })
  }
  getCompanyUsers = async () => {
    //const { accounts, userContract } = this.state;

    // Get the user information
    // const response = await userContract.methods.getUser().call({ from: accounts[0] });
    const companyUsers = [
      { name: 'User Test 1', tipoUsuario: 1 },
      { name: 'User Test 2', tipoUsuario: 1 },
      { name: 'User Test 3', tipoUsuario: 1 },
      { name: 'User Test 4', tipoUsuario: 2 },
    ]
    this.setState({ companyUsersInfo: companyUsers })
  }

  // ------------  Handlers FUNCTION ------------
  handleRegisterUser = async (userForm) => {
    const { accounts, userContract } = this.state;
    const res = await userContract.methods.registerUser(userForm.name, userForm.email, userForm.tipoUsuario, userForm.imageURI).send({ from: accounts[0] })
    const response = await userContract.methods.getUser().call({ from: accounts[0] });
    this.setState({ userInfo: response })
  };
  handleRegisterProject = async (projectForm) => {
    console.log("🚀 ~ App ~ registerProject= ~ projectForm:", projectForm)
    const projectToAdd = {
      ...projectForm,
      id: this.state.projectsInfo.length + 1
    }

    this.setState({ projectsInfo: [projectToAdd, ...this.state.projectsInfo] })
  };
  handleSelectProject = async (project) => {
    if (!!this.state.selectedProject && project.id === this.state.selectedProject.id) {
      this.setState({ selectedProject: null })
    } else {
      this.setState({ selectedProject: project })
    }
  };




  parseTipoUsuario(tipoUsuario) {
    console.log('🚀 ~ parseTipoUsuario ~ tipoUsuario:', tipoUsuario)
    switch (+tipoUsuario) {
      case 1:
        return "Alumno";
      case 2:
        return "Empresa";
      case 3:
        return "Instructor";
      case 4:
        return "Administrador";
      default:
        return "Unknown";
    }
  }

  render() {
    if (!this.state.web3Provider) {
      return <div className="App-no-web3">
        <h3>No Web3 connection... 🧐</h3>
        <p>Jump to the next chapter to configure the Web3 Provider.</p>
        <h3>Let's go! ⏭️</h3>
      </div>;
    }
    return (
      <div className="App">
        {/* ---- Context Information: Account & Network ---- */}
        <div className="User-header">
          <div className="Header-context-information">
            <p> Network connected: {this.state.networkId}</p>
            <p> Your address: {this.state.accounts[0]}</p>
            {this.state.userInfo && (
              <p> Bienvenido  {this.state.userInfo.name} 👋</p>
            )}
          </div>
        </div>
        <div className="User-body">
          {/* User not registered */}
          {!this.state.userInfo && (
            <div className="User-logged">
              <div className="card">
                <RegisterUser className="card" onRegisterUser={this.handleRegisterUser} />
              </div>
              {/* ---- Donation information ---- */}
              <div className="card">
                <DonationInformation totalDonations={this.state.totalDonations} myDonationAmount={this.state.myDonationAmount} />
              </div>

              <div className="card">
                <RegisterDonation onRegisterDonation={this.registerDonation} myDonationAmount={this.state.myDonationAmount} />
              </div>
            </div>
          )}

          {/* User registered */}
          {this.state.userInfo && (
            <div className="User-logged">
              <div className="User-common-actions">
                <div className="card">
                  <UserInformation className="card" user={this.state.userInfo} />
                </div>
                {/* ---- Donation information ---- */}
                {/* <div className="card">
                  <DonationInformation totalDonations={this.state.totalDonations} myDonationAmount={this.state.myDonationAmount} />
                </div>

                <div className="card">
                  <RegisterDonation onRegisterDonation={this.registerDonation} myDonationAmount={this.state.myDonationAmount} />
                </div> */}
              </div>
              <div className="User-custom-actions">
                {/* Alumno */}
                {+this.state.userInfo.tipoUsuario === 1 && (
                  <div className="card">
                    <StudentProjects className="card" studentProjects={this.state.studentProjectsInfo} onSelectProject={this.handleSelectProject} selectedProject={this.state.selectedProject} />
                    <h2>Acciones para el Alumno</h2>
                    <p>Proximamente...</p>
                    <button disabled >Enroll in course</button>
                  </div>
                )}
                {/* Empresa */}
                {+this.state.userInfo.tipoUsuario === 2 && (
                  <div className="card">
                    <RegisterProject className="card" onRegisterProject={this.handleRegisterProject} />
                    <CompanyProjects className="card" companyProjects={this.state.companyProjectsInfo} onSelectProject={this.handleSelectProject} selectedProject={this.state.selectedProject} />
                  </div>
                )}

                {+this.state.userInfo.tipoUsuario === 2 && this.state.selectedProject && (
                  <div className="card">
                    <ProjectInformation className="card" project={this.state.selectedProject} projectUsers={this.state.projectUsersInfo} />
                  </div>
                )}
                {/* <CompanyUsers className="card" companyUsers={this.state.companyUsersInfo} project={this.state.selectedProject} /> */}
                {/* Instructor */}
                {+this.state.userInfo.tipoUsuario === 3 && (
                  <div className="card">
                    <h2>Acciones para el Instructor</h2>
                    <p>Proximamente...</p>
                    <button disabled>Añadir notas</button>
                    <button disabled>Listar estudiantes</button>
                  </div>
                )}
                {/* Administrador */}
                {+this.state.userInfo.tipoUsuario === 4 && (
                  <div className="card">
                    {/* <RegisterProject className="card" onRegisterProject={this.handleRegisterProject} /> */}
                    <ProjectList className="card" projects={this.state.projectsInfo} onSelectProject={this.handleSelectProject} selectedProject={this.state.selectedProject} />
                  </div>
                )}
                {+this.state.userInfo.tipoUsuario === 4 && (
                  <div className="card">
                    {this.state.selectedProject && (
                      <AssignAmountToProject className="card" onRegisterDonation={this.handleSelectProject} project={this.state.selectedProject} /> 
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }


}