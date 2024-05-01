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
export const RegisterProject = ({ onRegisterProject }) => {
    const [projectForm, setProjectForm] = useState({});

    const onFormSubmit = e => {
        e.preventDefault();
        onRegisterProject(projectForm);
        setProjectForm({name:"" ,description:""});
    };

    return (
        <div className="Register-form">
            <form onSubmit={onFormSubmit}>
                <h2>Project Registration</h2>
                <div className="wave-group">
                    <input className="input" placeholder="Insert name" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Name" />
                </div>
                <div className="wave-group">
                    <input className="input" placeholder="Insert description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}></input>
                    <span className="bar"></span>
                    <AnimatedLabel text="Description" />
                </div>

                <button disabled={!projectForm.name || !projectForm.description} type="submit" >Register project</button>
            </form>
        </div>
    );
};
