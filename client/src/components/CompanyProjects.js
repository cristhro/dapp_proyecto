import React from "react";


export const CompanyProjects = ({ companyProjects, selectedProject, onSelectProject }) => {
    console.log('🚀 ~ CompanyProjects ~ companyProjects:', companyProjects)
    return (
        <div className="list-information">
            <h2>Company Projects</h2>
            <p>Select a project for do more actions</p>
            <table border="1">
                <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Status</th>
                </tr>

                {companyProjects.map(item => (
                    <tr key={item.id}
                        onClick={() => onSelectProject(item)}
                        style={{
                            backgroundColor: selectedProject && selectedProject.id === item.id ? 'lightblue' : 'inherit',
                            cursor: 'pointer'
                        }}
                    >
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.status}</td>
                    </tr>
                ))}

            </table>
        </div>
    );
};