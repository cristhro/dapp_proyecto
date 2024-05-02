import React from "react";
import { getRoleFormatted } from "../helpers/userRole";


export const ProjectUsersToAssign = ({ users, onSelectUser }) => {
    return (
        <div className="list-information">
            <h2>Project Users to Assign</h2>
            <table border="1">
                <tr>
                    <th>Nombre</th>
                    <th>Tipo de usuario</th>
                </tr>

                {users.map(item => (
                    <tr key={item.id} >
                        <td>{item.name}</td>
                        <td>{getRoleFormatted(item.role)}</td>
                        <td>  <button onClick={() => onSelectUser(item)} >Assing to a  project</button></td>
                    </tr>
                ))}

            </table>
        </div>
    );
};