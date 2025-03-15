import React, { useState, useEffect } from 'react';
import '../components/style.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    // Load email from localStorage (if available)
    const [email, setEmail] = useState(localStorage.getItem('email') || '');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if user is already logged in (so it does not redirect to login page after reload)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard', { replace: true }); // Auto redirect if token exists
        }
    }, [navigate]);

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Using 'await' to wait for the API response
            const res = await axios.post('http://localhost:3001/user/login', {
                email: email,
                password: password,
            }, { withCredentials: true });

            setLoading(false);
            toast.success('Logged in');

            // Store token and user info in localStorage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('fullName', res.data.fullName);
            localStorage.setItem('email', res.data.email);
            localStorage.setItem('imageURL', res.data.imageURL);
            localStorage.setItem('imageId', res.data.imageId);

            // Navigate to dashboard and refresh the page
            navigate('/dashboard', { replace: true });

            // Refresh the page after navigation to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 100);

        } catch (err) {
            setLoading(false);
            toast.error('Invalid credentials, please try again.');
            console.error(err);
        }
    };

    return (
        <div className='signup-wrapper'>
            <div className='signup-box'>
                <div className='signup-left'>
                    <img className='logo1' alt='ADX-Logo' src={require('../assets/logo2.png')} />
                </div>
                <div className='signup-right'>
                    <form onSubmit={submitHandler} className='form'>
                        <h1>Login to your account</h1>
                        <input required value={email} onChange={e => setEmail(e.target.value)} type='email' placeholder='Email' />
                        <input required onChange={e => setPassword(e.target.value)} type='password' placeholder='Password' />
                        <button type='submit'>{isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>} Submit</button>
                        <Link className='signup-login-link' to='/signup'>Create an account</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;

