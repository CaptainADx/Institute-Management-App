import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Courses = () => {
  const navigate = useNavigate();

  const [courseList, setCourseList] = useState([]);

  useEffect(()=>{
    getCourses();
  },[])

  const getCourses = () => {
    axios.get('http://localhost:3002/course/all-courses', {
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

  return (
    <div className='course-wrapper'>
      {
        courseList.map((course) => (
          <div onClick={() => {navigate(`/dashboard/course-details/${course._id}`)}} className='course-box' key={course._id}>
            <img alt={course.courseName} className='course-thumbnail' src={course.imageURL}/>
            <h2 className='course-title'>{course.courseName}</h2>
            <p className='course-price'> ₹{course.price}/- only</p>
          </div>
        ))
      }
    </div>
  )
}

export default Courses
