import React, { useState } from 'react'
import '../components/style.css';
import axios from 'axios';
import {toast} from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
const Login = () => {
    //Creating States 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);


    const navigate = useNavigate();  // using for routing to navigate to Login page after Signup Successfully
 
    
    const submitHandler = (event) => {
            event.preventDefault();

            setLoading(true);  //setting the loader to true to make it visible in submit button

            axios.post('http://localhost:3002/user/login',{
                email : email,
                password : password,
            })
            .then(res => {
                setLoading(false);   //When response is recieve it is set back to false to make it disappear
                toast.success('Logged in');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('fullName', res.data.fullName);
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('imageURL', res.data.imageURL);
                localStorage.setItem('imageId', res.data.imageId);
                navigate('/dashboard');
                console.log(res.data);
            })
            .catch(err => {
                setLoading(false);   //When error is recieve it is set back to false to make it disappear
                toast.error('Something is Wrong');
                console.log(err);
            })
    }

    return (
        <div className='signup-wrapper'>
            <div className='signup-box'>
                <div className='signup-left'>
                    <img className='logo1' alt='ADX-Logo' src={require('../assets/logo2.png')}/>
                    
                </div>
                <div className='signup-right'>
                    <form onSubmit={submitHandler} className='form'>
                        <h1>Login your account</h1>
                        <input required onChange={e => {setEmail(e.target.value)}} type='email' placeholder='Email' />
                        <input required onChange={e => {setPassword(e.target.value)}} type='password' placeholder='Password' />
                        <button type='submit'>{isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>} Submit</button>
                        <Link className='signup-login-link' to='/signup'>Create an account</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login