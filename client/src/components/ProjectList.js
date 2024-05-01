import React from "react";


export const ProjectList = ({ projects, selectedProject, onSelectProject }) => {
    console.log("🚀 ~ ProjectList ~ selectedProject:", selectedProject)
    console.log("🚀 ~ ProjectList ~ projects:", projects)
    return (
        <div className="list-information">
            <h2>Project List</h2>
            <table border="1">
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Description</th>
                    <th>Amount</th>
                </tr>

                {projects.map(item => (
                    <tr key={item.id}
                        onClick={() => onSelectProject(item)}
                        style={{
                            backgroundColor: selectedProject && selectedProject.id === item.id ? 'lightblue' : 'inherit',
                            cursor: 'pointer' // Cambiar el cursor a una mano
                        }}
                    >
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}

            </table>
        </div>
    );
};