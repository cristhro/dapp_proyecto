import React from "react";


export const UserList = ({ users, project }) => {
    console.log("🚀 ~ UserList ~ users:", users)
    return (
        <div className="list-information">
            <h2>Users Project of {project.name}</h2>
            <table border="1">
                <tr>
                    <th>Nombre</th>
                    <th>Tipo de usuario</th>
                    <th>Vinculado</th>
                </tr>

                {users.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.tipoUsuario}</td>
                        <td>{ }</td>
                    </tr>
                ))}

            </table>
        </div>
    );
};