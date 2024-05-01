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


        await instance.assignFundsToProject(0, web3.utils.toWei("3", "ether"), {
            from: admin,
            value: web3.utils.toWei("3", "ether")
        });

        //pruebas anteriores dejaron el proyecto como completado y no pasaba la distribucion de fondos se
        //agrega manualmente el estatus Active antes para asegurar (solo para pruebas)
        //await instance.changeProjectStatus(0, "Active", {from: company});
        
        await instance.completeAndDistributeFunds(0, {from: company});
        const balance = await web3.eth.getBalance(student1);
        assert(balance > web3.utils.toWei("0.99", "ether"), "Student should receive their share of the funds");
        
    });
});
