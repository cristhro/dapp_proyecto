const ProjectManagement = artifacts.require("./ProjectManagement");

contract("ProjectManagement", (accounts) => {
    const [admin, company, student1, student2, student3, student4] = accounts;

    it("should allow a company to create a project", async () => {
        const instance = await ProjectManagement.deployed();
        //await instance.setUserRole(company, "Company", {from: admin});
        await instance.setUserRole(company, 1, {from: admin}); // Aquí, '1' corresponde a 'Role.Company'
        await instance.createProject("Test Project", "This is a test project.", {from: company});
        const project = await instance.getProject(0);
        assert.equal(project.name, "Test Project", "Project name should match");
    });

    it("should allow a company to assign students to a project", async () => {
        const instance = await ProjectManagement.deployed();
        // await instance.setUserRole(student1, "Student", {from: admin});
        // await instance.setUserRole(student2, "Student", {from: admin});
        // await instance.setUserRole(student3, "Student", {from: admin});
        await instance.setUserRole(student1, 2, {from: admin});   // Aquí, '2' corresponde a 'Role.Student'
        await instance.setUserRole(student2, 2, {from: admin});   // Aquí, '2' corresponde a 'Role.Student'
        await instance.setUserRole(student3, 2, {from: admin});   // Aquí, '2' corresponde a 'Role.Student'

        await instance.assignStudentToProject(0, student1, {from: company});
        await instance.assignStudentToProject(0, student2, {from: company});
        await instance.assignStudentToProject(0, student3, {from: company});

       
        const project = await instance.getProject(0);
        assert.equal(project.assignedTo.length, 3, "There should be three students assigned to the project");
    });

    it("should allow a student to be assigned to and then removed from a project", async () => {
        const instance = await ProjectManagement.deployed();
        
        await instance.setUserRole(student4, 2, {from: admin});   // Aquí, '2' corresponde a 'Role.Student'
        
        // Asignar estudiante al proyecto
        await instance.assignStudentToProject(0, student4, {from: company});
        
        // Verificar que el estudiante está asignado al proyecto
        let assignedProjects = await instance.getProjectsAssignedToStudent(student4);
        assert.equal(assignedProjects.length, 1, "Student should be assigned to one project");
        assert.equal(assignedProjects[0].toNumber(), 0, "The student should be assigned to Test Project");

        // Remover estudiante del proyecto
        await instance.removeStudentFromProject(0, student4, {from: company});
        
        // Verificar que el estudiante ha sido removido del proyecto
        assignedProjects = await instance.getProjectsAssignedToStudent(student4);
        assert.equal(assignedProjects.length, 0, "Student4 should no longer be assigned to any projects");

        // Obtener detalles del proyecto para asegurar que 3 estudiantes están asignados
        const projectDetails = await instance.getProject(0);
        assert.equal(projectDetails.assignedTo.length, 3, "3 students should be assigned to the project after removal");
    });

    it("should distribute funds when a project is completed", async () => {
        const instance = await ProjectManagement.deployed();
        //await instance.assignFundsToProject(0, web3.utils.toWei("3", "ether"), {from: admin});

        // Asignar fondos al proyecto
        const assignAmount = web3.utils.toWei("9", "ether");

         // Fondos antes de asignar
         const initialContractBalance = await web3.eth.getBalance(instance.address);
         console.log(`Contract balance before assignment: ${web3.utils.fromWei(initialContractBalance, 'ether')} ETH`);


        await instance.assignFundsToProject(0, assignAmount, {
            from: admin,
            value: assignAmount
        });


         // Verificar fondos asignados al proyecto
         const project = await instance.getProject(0);
         assert.equal(project.funds.toString(), assignAmount, "The assigned funds should match the input amount");
 
         // Fondos después de asignar
         const finalContractBalance = await web3.eth.getBalance(instance.address);
         console.log(`Contract balance after assignment: ${web3.utils.fromWei(finalContractBalance, 'ether')} ETH`);


         //si separamos agregar fondos al contrato y asignar fondos al proyecto
        //  // Verificar que los fondos del contrato aún reflejan el depósito inicial menos los fondos asignados
        // assert.equal(
        //     finalContractBalance,
        //     BigInt(initialContractBalance) + BigInt(depositAmount) - BigInt(assignAmount),
        //     "Final contract balance should reflect the assigned funds"
        // );

            

        // Get initial balances of students
        const initialBalance1 = await web3.eth.getBalance(student1);
        const initialBalance2 = await web3.eth.getBalance(student2);
        const initialBalance3 = await web3.eth.getBalance(student3);

        console.log(`Initial balances: 
                    Student1: ${web3.utils.fromWei(initialBalance1, 'ether')} ETH,
                    Student2: ${web3.utils.fromWei(initialBalance2, 'ether')} ETH,
                    Student3: ${web3.utils.fromWei(initialBalance3, 'ether')} ETH`);



        
        await instance.completeAndDistributeFunds(0, {from: company});


        // Get final balances of students
        const finalBalance1 = await web3.eth.getBalance(student1);
        const finalBalance2 = await web3.eth.getBalance(student2);
        const finalBalance3 = await web3.eth.getBalance(student3);

        console.log(`Final balances: 
                    Student1: ${web3.utils.fromWei(finalBalance1, 'ether')} ETH,
                    Student2: ${web3.utils.fromWei(finalBalance2, 'ether')} ETH,
                    Student3: ${web3.utils.fromWei(finalBalance3, 'ether')} ETH`);

        // Check if the balances increased as expected
        assert(finalBalance1 > initialBalance1, "Student 1 did not receive funds correctly.");
        assert(finalBalance2 > initialBalance2, "Student 2 did not receive funds correctly.");
        assert(finalBalance3 > initialBalance3, "Student 3 did not receive funds correctly.");


       
        // const balance = await web3.eth.getBalance(student1);
        // assert(balance > web3.utils.toWei("0.99", "ether"), "Student should receive their share of the funds");
        
    });
});
