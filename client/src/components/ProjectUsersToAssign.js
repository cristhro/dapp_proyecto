import React from "react";


export const ProjectUsersToAssign = ({ users, project }) => {
    return (
        <div className="list-information">
            <h2>Project Users to Assign</h2>
            <table border="1">
                <tr>
                    <th>Nombre</th>
                    <th>Tipo de usuario</th>
                </tr>

                {users.map(item => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{parseTipoUsuario(item.tipoUsuario)}</td>
                        <td> <button type="submit" >Assing to a  project</button></td>
                    </tr>
                ))}

            </table>
        </div>
    );

    function parseTipoUsuario(tipoUsuario) {
        console.log('🚀 ~ parseTipoUsuario ~ tipoUsuario:', tipoUsuario)
        switch (+tipoUsuario) {
            case 1:
                return "Alumno";
            case 2:
                return "Empresa";
            case 3:
                return "Instructor";
            case 4:
                return "Administrador";
            default:
                return "Unknown";
        }
    }
};