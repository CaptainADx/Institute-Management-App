import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      console.log(location.state);
      setCourseName(location.state.course.courseName);
      setDescription(location.state.course.description);
      setPrice(location.state.course.price);
      setStartDate(location.state.course.startDate);
      setEndDate(location.state.course.endDate);
      setImageUrl(location.state.course.imageURL);
    }
    else {
      setCourseName('');
      setDescription('');
      setPrice('');
      setStartDate('');
      setEndDate('');
      setImageUrl('');
    }
  }, [location.state]);

  const submitHandler = (e) => {
    e.preventDefault();  // prevent the reload of page when submit button is clicked

    setLoading(true);

    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);

    if(image){
      formData.append('image', image);
    }

    if(location.state){
      axios.put('http://localhost:3001/course/'+location.state.course._id, formData, {
        headers:{
          Authorization : 'Bearer '+localStorage.getItem('token'),
        }
      })
    .then(res => {
      setLoading(false);
      console.log(res.data);
      toast.success('Course updated successfully');
      navigate('/dashboard/All-Courses', location.state.course._id);
    })
    .catch(err => {
      setLoading(false);
      console.log(err);
      toast.error('Something went wrong');
    })
    console.log(courseName, description, price, startDate, endDate, image);
  }

  else {
    axios.put('http://localhost:3001/course/add-course', formData, {
      headers:{
        Authorization : 'Bearer '+localStorage.getItem('token'),
      }
    })
  .then(res => {
    setLoading(false);
    console.log(res.data);
    toast.success('Course Added successfully');
    navigate('/dashboard/All-Courses', location.state.course._id);
  })
  .catch(err => {
    setLoading(false);
    console.log(err);
    toast.error('Something went wrong');
  })
  }
}

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1> {location.state ? 'Edit Course' : 'Add a new course'} </h1>
        <input value={courseName} required onChange={e => {setCourseName(e.target.value)}} placeholder='Course Name' type='text' />
        <input value = {description} required onChange={e => {setDescription(e.target.value)}} placeholder='Description' type='text' />
        <input value = {price} required onChange={e => {setPrice(e.target.value)}} placeholder='Price' type='text' />
        <input value = {startDate} required onChange={e => {setStartDate(e.target.value)}} placeholder='Start Date (DD-MM-YYYY)' type='text' />
        <input value = {endDate} required onChange={e => {setEndDate(e.target.value)}} placeholder='End Date (DD-MM-YYYY)' type='text' />
        <input required={!location.state} onChange={fileHandler} placeholder='Thumbnail' type='file' />
        {imageUrl && <img className='your-logo' alt='your-logo' src={imageUrl} />}
        <button className='submit-btn' type='submit'>{isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>} Submit</button>
      </form>
    </div>
  )
}

export default AddCourses
