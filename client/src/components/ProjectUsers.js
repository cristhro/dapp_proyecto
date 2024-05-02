import React from "react";
import { getRoleFormatted } from "../helpers/userRole";


export const ProjectUsers = ({ users, unassignedStudents }) => {
    console.log('🚀 ~ ProjectUsers ~ unassignedStudents:', unassignedStudents)
    console.log('🚀 ~ ProjectUsers ~ users:', users)
    return (
        <div className="list-information">
            <h2>Project Users</h2>
            <table border="1">
                <tr>
                    <th>Nombre</th>
                    <th>Tipo de usuario</th>
                </tr>

                {users.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{getRoleFormatted(item.role)}</td>
                    </tr>
                ))}

            </table>
        </div>
    );
};