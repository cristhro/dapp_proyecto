import React from "react";


export const ProjectUsers = ({ users }) => {
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
                        <td>{parseTipoUsuario(item.tipoUsuario)}</td>
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