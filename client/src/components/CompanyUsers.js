import React from "react";


export const CompanyUsers = ({ companyUsers, project }) => {
    console.log("🚀 ~ companyUsers ~ companyUsers:", companyUsers)
    return (
        <div className="list-information">
            <h2>Company Users</h2>
            <table border="1">
                <tr>
                    <th>Nombre</th>
                    <th>Tipo de usuario</th>
                    <th>Vinculado</th>
                </tr>

                {companyUsers.map(item => (
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