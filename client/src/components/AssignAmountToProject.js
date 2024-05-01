import React, { useState } from "react";
const AnimatedLabel = ({ text }) => {
    return (
        <label className="label">
            {text.split('').map((char, index) => (
                <span className="label-char" style={{ '--index': index }} key={index}>
                    {char}
                </span>
            ))}
        </label>
    );
};
export const AssignAmountToProject = ({ onRegisterDonation, project }) => {
    const [value, setValue] = useState(0);

    const onFormSubmit = e => {
        e.preventDefault();
        onRegisterDonation(value);
        setValue(0);
    };

    return (
        <div className="Register-form">
            <form onSubmit={onFormSubmit}>
                <h2>Asignar fondos al proyecto {project.name}</h2>
                <div className="wave-group">
                    <input className="input" type="number" placeholder="Insert cantidad" value={value} onChange={(e) => setValue(e.target.value)}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Cantidad (ETH)" />
                </div>
                <br></br>
                <button disabled={value == 0} type="submit" >Asignar fondos</button>
            </form>
        </div>
    );
};
