import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';

const CourseDetails = () => {

    const navigate = useNavigate();

    const [course, setCourses] = useState(null);
    const [studentList, setStudentList] = useState([]);

    const params = useParams();

    useEffect(() => {
        getCourseDetails();
    }, [])

    const getCourseDetails = () => {
        axios.get(`http://localhost:3001/course/course-details/${params.id}`, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token'),
            }
        })
            .then(res => {
                console.log(res.data);
                setCourses(res.data.course);
                setStudentList(res.data.studentList);
            })
            .catch(err => {
                console.log(err);
                toast.error('Something went wrong')
            })
    }

    return (
        <div className='course-details-main-wrapper'>
            {
                course && <div >
                    <div className='course-details-wrapper'>
                        <img alt={course.courseName} src={course.imageURL} />
                        <div>
                            <h1>{course.courseName}</h1>
                            <p>Price :- {course.price}/-</p>
                            <p>Start Date :- {course.startDate}</p>
                            <p>End Date :- {course.endDate}</p>
                        </div>
                        <div>
                            <div className='button-container'>
                                <button className='primary-btn' onClick= {()=> {navigate('/dashboard/update-courses/'+course._id,{state:{course}})}}> Edit</button>
                                <button className='secondary-btn'>Delete</button>
                            </div>
                            <h3>Course Description</h3>
                            <div className='course-description-container'>
                                <p>{course.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {
                studentList && studentList.length > 0 && <div>
                    <div className='student-list-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Profile Pic</th>
                                    <th>Full Name</th>
                                    <th>Phone</th>
                                    <th>E-mail</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map((student) => (
                                    <tr className='student-row' key={student.id || student.email}>
                                        <td><img className='student-profile-pic' alt='student profile pic' src={student.imageURL} /></td>
                                        <td><p>{student.fullName}</p></td>
                                        <td><p>{student.phone}</p></td>
                                        <td><p>{student.email}</p></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
        </div>
    )
}

export default CourseDetails
