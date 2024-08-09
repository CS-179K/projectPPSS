import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useAuth } from '../Context/AuthContext';  // Ensure this path is correct

import './style.css';

const Login = () => {
    const navigate = useNavigate();
    const { login, logout } = useAuth(); // Use login and logout functions from AuthContext

    const handleGoogleSuccess = (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse?.credential);
            console.log('Google Login Success:', credentialResponse);
            login(decoded);  // Log the user in
            navigate('/home');
        } catch (error) {
            console.error('Error decoding JWT:', error);
            handleGoogleFailure();
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google Login Failed:', error);
        logout();  // Ensure the user is logged out on failure
    };

    const handleGitHubLogin = () => {
        const clientId = "Ov23liysucDKwn4M62Hi";
        const redirectUri = encodeURIComponent("http://localhost:3000/github-callback");
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    };

    const handleGitHubCallback = async (code) => {
        try {
            const response = await axios.post(`http://localhost:3000/home`, { // Update with actual backend route
                code: code, // The code received from GitHub
            });
            const token = response.data.token; // Assuming your backend sends back a token
            console.log('GitHub Login Success:', token);
            login(token);  // Log the user in
            navigate('/home');
        } catch (error) {
            console.error('GitHub Login Failed', error);
            logout();  // Ensure the user is logged out on failure
        }
    };

    // Effect to handle GitHub callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            handleGitHubCallback(code);
        }
    }, []);

    return (
        <div className="container">
            <div className="signin-box">
                <h2>Sign in</h2>
                <div className="social-signin">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                    />
                    <div className="separator">or</div>
                    <button onClick={handleGitHubLogin}>Sign in with GitHub</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
