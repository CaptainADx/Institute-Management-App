import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddStudents = () => {

  //GETTING THE COURSE LIST
  
  useEffect(()=>{
    getCourses();
  },[])
  
  const getCourses = () => {
    axios.get('http://localhost:3001/course/all-courses', {
      headers : {
        Authorization : 'Bearer ' + localStorage.getItem('token'),
      }
    })
    .then(res => {
      console.log(res.data.courses);
      setCourseList(res.data.courses);
    })
    .catch(err => {
      console.log(err);
      toast.error('Something went wrong')
    })
  }
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [courseId, setCourseId] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);

  const [courseList, setCourseList] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();  // prevent the reload of page when submit button is clicked

    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('courseId', courseId);
    formData.append('image', image);

    axios.post('http://localhost:3001/student/add-student', formData, {
      headers:{
        Authorization : 'Bearer '+localStorage.getItem('token'),
      }
    })
    .then(res => {
      setLoading(false);
      console.log(res.data);
      toast.success('New student added successfully');
      navigate('/dashboard/All-Courses');
    })
    .catch(err => {
      setLoading(false);
      console.log(err);
      toast.error('Something went wrong');
    })
    

    console.log(fullName,phone,email,address,image);
  }

  const fileHandler = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      <form onSubmit={submitHandler} className='form'>
        <h1>Add a new student</h1>
        <input required onChange={(e) => setFullName(e.target.value)} placeholder='Full Name' type='text'/>
        <input required onChange={(e) => setPhone(e.target.value)} placeholder='Phone Number' type='text'/>
        <input required onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='text'/>
        <input required onChange={(e) => setAddress(e.target.value)} placeholder='Address' type='text'/>
        <select required onChange={(e) => setCourseId(e.target.value)}>
          <option>Select Course</option>
          {
            courseList.map((course)=>(
              <option value={course._id}>{course.courseName}</option>
            ))
          }
        </select>
        <input required onChange={fileHandler} placeholder='Thumbnail' type='file' />
        {imageUrl && <img className='your-logo' alt='student-pic' src={imageUrl} />}
        <button className='submit-btn' type='submit'>{isLoading && <i className="fa-solid fa-circle-notch fa-spin"></i>} Submit</button>
      </form>
    </div>
  )
}

export default AddStudents
