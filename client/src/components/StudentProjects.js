import React from "react";


export const StudentProjects = ({ studentProjects, selectedProject, onSelectProject }) => {
    console.log("🚀 ~ StudentProjects ~ selectedProject:", selectedProject)
    console.log("🚀 ~ StudentProjects ~ studentProjects:", studentProjects)
    return (
        <div className="list-information">
            <h2>Student Project</h2>
            <table border="1">
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Description</th>
                </tr>
                {studentProjects.map(item => (
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
                    </tr>
                ))}

            </table>
        </div>
    );
};