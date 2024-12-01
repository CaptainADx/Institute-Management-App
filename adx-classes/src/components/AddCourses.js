import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCourses = () => {

  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('')
  const [image, setImage] = useState(null);

  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();  // prevent the reload of page when submit button is clicked

    setLoading(true);

    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('image', image);

    axios.post('http://localhost:3001/course/add-course', formData, {
      headers:{
        Authorization : 'Bearer '+localStorage.getItem('token'),
      }
    })
    .then(res => {
      setLoading(false);
      console.log(res.data);
      toast.success('Course added successfully');
      navigate('/dashboard/All-Courses');
    })
    .catch(err => {
      setLoading(false);
      console.log(err);
      toast.error('Something went wrong');
    })
    

    console.log(courseName, description, price, startDate, endDate, image);
  }

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1>Add a new course</h1>
        <input required onChange={e => {setCourseName(e.target.value)}} placeholder='Course Name' type='text' />
        <input required onChange={e => {setDescription(e.target.value)}} placeholder='Description' type='text' />
        <input required onChange={e => {setPrice(e.target.value)}} placeholder='Price' type='text' />
        <input required onChange={e => {setStartDate(e.target.value)}} placeholder='Start Date (DD-MM-YYYY)' type='text' />
        <input required onChange={e => {setEndDate(e.target.value)}} placeholder='End Date (DD-MM-YYYY)' type='text' />
        <input required onChange={fileHandler} placeholder='Thumbnail' type='file' />
        {imageUrl && <img className='your-logo' alt='your-logo' src={imageUrl} />}
        <button className='submit-btn' type='submit'>{isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>} Submit</button>
      </form>
    </div>
  )
}

export default AddCourses
