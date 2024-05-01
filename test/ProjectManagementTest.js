const ProjectManagement = artifacts.require("./ProjectManagement");

contract("ProjectManagement", (accounts) => {
    const [admin, company, student1, student2, student3] = accounts;

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

    it("should distribute funds when a project is completed", async () => {
        const instance = await ProjectManagement.deployed();
        //await instance.assignFundsToProject(0, web3.utils.toWei("3", "ether"), {from: admin});


        await instance.assignFundsToProject(0, web3.utils.toWei("9", "ether"), {
            from: admin,
            value: web3.utils.toWei("9", "ether")
        });

        
        //pruebas anteriores dejaron el proyecto como completado y no pasaba la distribucion de fondos se
        //agrega manualmente el estatus Active antes para asegurar (solo para pruebas)
        //await instance.changeProjectStatus(0, "Active", {from: company});

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
