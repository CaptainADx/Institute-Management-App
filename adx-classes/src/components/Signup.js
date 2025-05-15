import React, { useState } from 'react'
import '../components/style.css';
import axios from 'axios';
import {toast} from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
 
const Signup = () => {
    //Creating States 
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setLoading] = useState(false);


    const navigate = useNavigate();  // using for routing to navigate to Login page after Signup Successfully
 
    
    const submitHandler = (event) => {
            event.preventDefault();

            setLoading(true);  //setting the loader to true to make it visible in submit button

            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('image', image);

            axios.post('http://localhost:3002/user/signup', formData)
            .then(res => {
                setLoading(false);   //When response is recieve it is set back to false to make it disappear
                toast.success('Your account is created successfully');
                navigate('/login');
                console.log(res);
            })
            .catch(err => {
                setLoading(false);   //When error is recieve it is set back to false to make it disappear
                toast.error('Something is Wrong');
                console.log(err);
            })
    }

    const fileHandler = (e) => {
        setImage(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
    }


    return (
        <div className='signup-wrapper'>
            <div className='signup-box'>
                <div className='signup-left'>
                    <img className='logo1' alt='ADX-Logo' src={require('../assets/logo2.png')}/>
                    
                </div>
                <div className='signup-right'>
                    <form onSubmit={submitHandler} className='form'>
                        <h1>Create your account</h1>
                        <input required onChange={e => {setFullName(e.target.value)} } type='text' placeholder='Institute Name' />
                        <input required onChange={e => {setEmail(e.target.value)}} type='email' placeholder='Email' />
                        <input required onChange={e => {setPhone(e.target.value)}} type='text' placeholder='Phone Number' />
                        <input required onChange={e => {setPassword(e.target.value)}} type='password' placeholder='Password' />
                        <input required onChange={fileHandler} type='file' />
                        {imageUrl && <img className='your-logo' alt='your-logo' src={imageUrl} />}
                        <button type='submit'>{isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>} Submit</button>
                        <Link className='signup-login-link' to='/login'>Login to your Account</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup