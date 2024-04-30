// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract ProjectManagement {

    struct Project {
        uint id;
        string name;
        string description;
        string status; // Active, Paused, Completed
        address[] assignedTo; // Direcciones de los alumnos asignados al proyecto
        uint funds; // Fondos asignados al proyecto
    }

    enum Role { Admin, Company, Student }
    struct User {
        Role role;
        address userAddress;
    }

    Project[] public projects;
    uint public nextProjectId;
    mapping(address => Role) public roles;
    mapping(uint => address) public projectOwners;

    event FundsAssigned(uint projectId, uint amount);
    event FundsDistributed(uint projectId, uint amount, address student);

    constructor() {
        roles[msg.sender] = Role.Admin; // El creador del contrato es el administrador
    }

    function setUserRole(address _user, Role _role) public {
        require(roles[msg.sender] == Role.Admin, "Only admin can set roles");
        roles[_user] = _role;
    }

    function createProject(string memory _name, string memory _description) public {
        require(roles[msg.sender] == Role.Company, "Only companies can create projects");
        //projects.push(Project(nextProjectId, _name, _description, "Active", new address[], 0));
        projects.push(Project(nextProjectId, _name, _description, "Active", new address[](0), 0));
        //projects.push(Project({id:nextProjectId, name:_name, description: _description, status: "Active", assignedTo: new address[](0) , funds: 0}));

        projectOwners[nextProjectId] = msg.sender;
        nextProjectId++;
    }

    function assignFundsToProject(uint _projectId, uint _amount) public {
        require(roles[msg.sender] == Role.Admin, "Only admin can assign funds");
        require(_amount > 0, "Amount must be greater than 0");
        Project storage project = projects[_projectId];
        project.funds += _amount;
        emit FundsAssigned(_projectId, _amount);
    }

    function assignStudentToProject(uint _projectId, address _student) public {
        require(roles[msg.sender] == Role.Company, "Only companies can assign students");
        require(roles[_student] == Role.Student, "Can only assign projects to students");
        require(projectOwners[_projectId] == msg.sender, "Only project owner can assign students");
        require(isStudentAssignedToProject(_projectId, _student) == false, "Student already assigned to this project");

        Project storage project = projects[_projectId];
        project.assignedTo.push(_student);
    }

     function removeStudentFromProject(uint _projectId, address _student) public {
        require(roles[msg.sender] == Role.Company, "Only companies can remove students");
        require(projectOwners[_projectId] == msg.sender, "Only project owner can remove students");

        Project storage project = projects[_projectId];
        uint i = 0;
        while (i < project.assignedTo.length && project.assignedTo[i] != _student) {
            i++;
        }
        if (i < project.assignedTo.length) { // Student found
            project.assignedTo[i] = project.assignedTo[project.assignedTo.length - 1]; // Move the last element into the deleted spot
            project.assignedTo.pop(); // Remove the last element
        }
    }

    function isStudentAssignedToProject(uint _projectId, address _student) internal view returns (bool) {
    Project memory project = projects[_projectId];
    for (uint i = 0; i < project.assignedTo.length; i++) {
        if (project.assignedTo[i] == _student) {
            return true;
        }
    }
    return false;
}


    function viewStudentFunds() public view returns (uint totalFunds) {
        require(roles[msg.sender] == Role.Student, "Only students can view their funds");
        totalFunds = 0;
        for (uint i = 0; i < projects.length; i++) {
            Project memory project = projects[i];
            for (uint j = 0; j < project.assignedTo.length; j++) {
                if (project.assignedTo[j] == msg.sender) {
                    totalFunds += project.funds;
                }
            }
        }
        return totalFunds;
    }

    function viewProjectFunds(uint _projectId) public view returns (uint) {
        require(roles[msg.sender] == Role.Admin, "Only admin can view funds");
        return projects[_projectId].funds;
    }

    function completeAndDistributeFunds(uint _projectId) public {
        require(roles[msg.sender] == Role.Company, "Only companies can distribute funds");
        require(projectOwners[_projectId] == msg.sender, "Only project owner can distribute funds");
        Project storage project = projects[_projectId];
        //require(keccak256(bytes(project.status)) == keccak256(bytes("Active")), "Project must be Active to complete");
        
        project.status = "Completed";
        uint amountPerStudent = project.funds / project.assignedTo.length;
        for (uint i = 0; i < project.assignedTo.length; i++) {
            payable(project.assignedTo[i]).transfer(amountPerStudent);
            emit FundsDistributed(_projectId, amountPerStudent, project.assignedTo[i]);
        }
        project.funds = 0; // Clear the funds after distribution
    }

    function getProject(uint _projectId) public view returns (Project memory) {
        return projects[_projectId];
    }

    function changeProjectStatus(uint _projectId, string memory _newStatus) public {
        require(projectOwners[_projectId] == msg.sender, "Only project owner can change the status");
        Project storage project = projects[_projectId];
        project.status = _newStatus;
    }

    function editProject(uint _projectId, string memory _name, string memory _description) public {
        require(projectOwners[_projectId] == msg.sender, "Only project owner can edit the project");
        Project storage project = projects[_projectId];
        project.name = _name;
        project.description = _description;
    }
}
