import React from "react";
import { getRoleFormatted } from "../helpers/userRoleHelpers";


export const UserInformation = ({ user, account }) => {
    return (
        <div className="User-information">
            <h2>User Information</h2>

            {/* User Image */}
            <div className="User-information-img">
                {user.imageURI && <img src={user.imageURI}></img>}
            </div>
            {/* User information */}
            <div className="User-information-text">
                <p><b>User Name:</b> {user.name}</p>
                <p><b>User Type:</b> {getRoleFormatted(user.role)}</p> 
                <p><b>Amount: </b>12 ETH</p>
            </div>
        </div>
    );
};