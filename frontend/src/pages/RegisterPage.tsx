import React, { FormEvent, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const { registerUser } = useContext(AuthContext);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        console.log("handing register");
        const userData = {
            username: form.username.value,
            email: form.email.value,
            password: form.password.value,
        };
        console.log(userData);

        registerUser(userData);
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <input type="text" name="username" placeholder="Enter username" />
                <input type="email" name="email" placeholder="Enter email" />
                <input type="password" name="password" placeholder="Enter password" />
                <input type="submit" value="Register" />
            </form>
        </div>
    );
};

export default RegisterPage;
