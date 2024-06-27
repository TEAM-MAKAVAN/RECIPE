import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router DOM

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                'http://localhost:8001/api/v1/users/login',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
    
            // Extract token from response data
            // const { accessToken } = response.data;
            // 
             const accessToken = response.data.data.accessToken;
console.log(accessToken)

            // Logging accessToken to the console
            // console.log(response);
    
            // Store the token in localStorage
            localStorage.setItem('jwtToken', accessToken);
            //  // Assuming the token is returned in response.data.token
            //  localStorage.setItem('authToken', response.data.token);
    
            // Redirect to main home page after successful login
            navigate('/MainHomePage'); // Replace '/MainHomePage' with your desired home page URL
        } catch (error) {
            console.error(error); // Handle any errors
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form style={{ width: '300px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} onSubmit={handleSubmit}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
