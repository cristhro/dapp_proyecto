import React from "react";
import { ProjectUsers } from "./ProjectUsers";
import { ProjectUsersToAssign } from "./ProjectUsersToAssign";
import { getStatusFormatted } from "../helpers/projectStatus";


export const ProjectInformation = ({ project, projectUsers, unassignedStudents, onAssignUser }) => {
    return (
        <div className="User-information">
            <h2>Selected project: {project.name }</h2>
        
            {/* User information */}
            <div className="User-information-text">
                <p><b>Project Name:</b> {project.name}</p>
                <p><b>Project Status:</b> {getStatusFormatted(project.status)}</p> 
                <p><b>Fondos asignados:</b> {project.amount} ETH</p> 
                <button type="submit" >Finalizar project</button>
            </div>
            <ProjectUsers className="card" project={project} users={projectUsers} unassignedStudents={unassignedStudents} />
            <ProjectUsersToAssign className="card" project={project} users={unassignedStudents} onSelectUser={onAssignUser} />

        </div>
    );
};