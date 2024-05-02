// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract ProjectManagement {
    enum ProjectStatus { Active, Paused, Completed }
    enum Role { Admin, Company, Student }
    struct Project {
        uint id;
        string name;
        string description;
        ProjectStatus status; // Active, Paused, Completed
        address[] assignedTo; // Direcciones de los alumnos asignados al proyecto
        uint funds; // Fondos asignados al proyecto
    }
    struct User {
        address userAddress;
        string name;
        string email;
        Role role; // 1: Alumno, 2: Empresa, 3: Instructor, 4: Administrador
        string imageURI;
        bool isActive;
        bool exists;
    }
    

    Project[] public projects;
    uint public nextProjectId;
    mapping(address => Role) public roles;
    mapping(uint => address) public projectOwners;
    mapping(address => uint[]) public studentProjects;
    mapping(address => User) private users;             // Mapping para almacenar usuarios por ID
    // Evento para notificar el registro de un nuevo usuario
    event UserRegistered(string name, string email, Role role);
    event FundsAssigned(uint projectId, uint amount);
    event FundsDistributed(uint projectId, uint amount, address student);

    constructor() {
        roles[msg.sender] = Role.Admin; // El creador del contrato es el administrador
    }
    // USER MANAGEMENT
    // ----------------
    function setUserRole(address _user, Role _role) public {
        require(roles[msg.sender] == Role.Admin, "Only admin can set roles");
        roles[_user] = _role;
    }

    function registerUser( string memory _name, string memory _email, Role _role, string memory _imageURI) public {
        require(!users[msg.sender].exists, "User already registered.");
        users[msg.sender] = User(msg.sender, _name, _email, _role, _imageURI, false, true);
        emit UserRegistered(_name, _email, _role );
    }

    // Función para obtener los datos de un usuario
    function getUser() public view returns (User memory) {
        require(users[msg.sender].exists, "El usuario no existe");
        return users[msg.sender];
    }

    // ----------------
    function createProject(string memory _name, string memory _description) public {
        require(roles[msg.sender] == Role.Company, "Only companies can create projects");
        //projects.push(Project(nextProjectId, _name, _description, "Active", new address[], 0));
        projects.push(Project(nextProjectId, _name, _description, ProjectStatus.Active, new address[](0), 0));
        //projects.push(Project({id:nextProjectId, name:_name, description: _description, status: "Active", assignedTo: new address[](0) , funds: 0}));

        projectOwners[nextProjectId] = msg.sender;
        nextProjectId++;
    }

   

    // Hace que la función sea payable para aceptar fondos de Ether
    function assignFundsToProject(uint _projectId, uint _amount) public payable {
        require(roles[msg.sender] == Role.Admin, "Only admin can assign funds to projects");
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.value == _amount, "Transaction value must match the amount to assign");  // Asegura que el Ether enviado coincida con el argumento _amount
        require(_projectId < projects.length, "Project does not exist");  // Verifica que el proyecto exista

        Project storage project = projects[_projectId];
        project.funds += msg.value;  // Añade el Ether enviado directamente a los fondos del proyecto
         emit FundsAssigned(_projectId, _amount);
    }

    function assignStudentToProject(uint _projectId, address _student) public {
        require(roles[msg.sender] == Role.Company, "Only companies can assign students");
        require(roles[_student] == Role.Student, "Can only assign projects to students");
        require(projectOwners[_projectId] == msg.sender, "Only project owner can assign students");
        require(isStudentAssignedToProject(_projectId, _student) == false, "Student already assigned to this project");

        Project storage project = projects[_projectId];
        project.assignedTo.push(_student);

        studentProjects[_student].push(_projectId);
    }

    //  function removeStudentFromProjectOld(uint _projectId, address _student) public {
    //     require(roles[msg.sender] == Role.Company, "Only companies can remove students");
    //     require(projectOwners[_projectId] == msg.sender, "Only project owner can remove students");

    //     Project storage project = projects[_projectId];
    //     uint i = 0;
    //     while (i < project.assignedTo.length && project.assignedTo[i] != _student) {
    //         i++;
    //     }
    //     if (i < project.assignedTo.length) { // Student found
    //         project.assignedTo[i] = project.assignedTo[project.assignedTo.length - 1]; // Move the last element into the deleted spot
    //         project.assignedTo.pop(); // Remove the last element
    //     }
    // }

    // Función para eliminar un estudiante de un proyecto
    function removeStudentFromProject(uint projectId, address student) public {

        require(roles[msg.sender] == Role.Company, "Only companies can remove students");
        require(projectOwners[projectId] == msg.sender, "Only project owner can remove students");

        // Primero, actualizamos la lista del proyecto
        uint studentIndex = findStudentIndex(projectId, student);
        require(studentIndex < projects[projectId].assignedTo.length, "Student not found in project");
        
        // Eliminar estudiante del proyecto
        projects[projectId].assignedTo[studentIndex] = projects[projectId].assignedTo[projects[projectId].assignedTo.length - 1];
        projects[projectId].assignedTo.pop();

        // Segundo, actualizamos el mapeo del estudiante
        uint projectIndex = findProjectIndex(student, projectId);
        require(projectIndex < studentProjects[student].length, "Project not found for student");
        
        // Eliminar proyecto del estudiante
        studentProjects[student][projectIndex] = studentProjects[student][studentProjects[student].length - 1];
        studentProjects[student].pop();
    }


    // Helper para encontrar el índice de un estudiante en un proyecto
    function findStudentIndex(uint projectId, address student) private view returns (uint) {
        for (uint i = 0; i < projects[projectId].assignedTo.length; i++) {
            if (projects[projectId].assignedTo[i] == student) {
                return i;
            }
        }
        revert("Student not found");
    }

    // Helper para encontrar el índice de un proyecto en la lista de un estudiante
    function findProjectIndex(address student, uint projectId) private view returns (uint) {
        for (uint i = 0; i < studentProjects[student].length; i++) {
            if (studentProjects[student][i] == projectId) {
                return i;
            }
        }
        revert("Project not found");
    }

    // Función para obtener los proyectos asignados a un estudiante
    function getProjectsAssignedToStudent(address student) public view returns (uint[] memory) {
        return studentProjects[student];
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
        // require(roles[msg.sender] == Role.Company, "Only companies can distribute funds");
        // require(projectOwners[_projectId] == msg.sender, "Only project owner can distribute funds");
        Project storage project = projects[_projectId];
        require(project.status == ProjectStatus.Active, "Project must be Active to complete");
        require(project.funds > 0, "No funds available for distribution");
        require(project.funds <= address(this).balance, "Contract does not have enough funds");

        uint totalAssigned = project.assignedTo.length;
        require(totalAssigned > 0, "No students to distribute funds to");
        
        project.status = ProjectStatus.Completed;
        uint amountPerStudent = project.funds / totalAssigned;
        for (uint i = 0; i < project.assignedTo.length; i++) {
            payable(project.assignedTo[i]).transfer(amountPerStudent);
            emit FundsDistributed(_projectId, amountPerStudent, project.assignedTo[i]);
        }
        project.funds = 0; // Clear the funds after distribution
    }

    function getProject(uint _projectId) public view returns (Project memory) {
        return projects[_projectId];
    }
    function getProjects(uint _projectId) public view returns (Project memory) {
        return projects[_projectId];
    }

    function changeProjectStatus(uint _projectId, ProjectStatus  _newStatus) public {
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
