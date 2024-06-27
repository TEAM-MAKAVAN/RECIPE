import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        profilePicture: null
    });
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('username', formData.username);
        formDataToSend.append('profilePicture', formData.profilePicture);

        try {
            const response = await axios.post('http://localhost:8001/api/v1/users/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Registration successful:', response.data);
            window.alert('Registration successful! Please check your email for the OTP.');
            setIsOtpSent(true);
        } catch (error) {
            console.error('Error registering user:', error);
            window.alert('Error registering user. Please try again.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8001/api/v1/users/verify-otp', 
                `email=${encodeURIComponent(formData.email)}&otp=${encodeURIComponent(otp)}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log('OTP verification successful:', response.data);
            window.alert('OTP verification successful!');
            navigate('/login');
        } catch (error) {
            console.error('Error verifying OTP:', error);
            window.alert('Error verifying OTP. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            {!isOtpSent ? (
                <form onSubmit={handleRegister}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

                    <label htmlFor="profilePicture">Profile Picture:</label>
                    <input type="file" id="profilePicture" name="profilePicture" onChange={handleChange} accept="image/*" required />

                    <button type="submit">Register</button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp}>
                    <label htmlFor="otp">Enter OTP:</label>
                    <input type="text" id="otp" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                    <button type="submit">Verify OTP</button>
                </form>
            )}
        </div>
    );
};

export default Register;
