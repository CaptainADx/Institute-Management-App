import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Students = () => {
  const [studentList, setStudentList] = useState([]);
  const [courseList, setCourseList] = useState([]);

  useEffect(() => {
    getStudentList();
    getCourses();
  }, []);

  const getStudentList = () => {
    axios.get('http://localhost:3001/student/all-students', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }
    })
      .then(res => {
        console.log(res.data);
        setStudentList(res.data.students);
      })
      .catch(err => {
        console.log(err);
        toast.error('Something went wrong');
      });
  };

  const getCourses = () => {
    axios.get('http://localhost:3001/course/all-courses', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      }
    })
      .then(res => {
        console.log(res.data.courses);
        setCourseList(res.data.courses);
      })
      .catch(err => {
        console.log(err);
        toast.error('Something went wrong');
      });
  };

  // Helper function to get the course name by courseId
  const getCourseName = (courseId) => {
    const course = courseList.find(course => course._id === courseId);
    return course ? course.courseName : 'No course assigned';
  };

  return (
    <div>
      {
        studentList && studentList.length > 0 && <div>
          <div className='students-container'>
            <table>
              <thead>
                <tr>
                  <th>Profile Pic</th>
                  <th>Full Name</th>
                  <th>Phone</th>
                  <th>E-mail</th>
                  <th>Course</th>
                </tr>
              </thead>
              <tbody>
                {studentList.map((student) => (
                  <tr key={student._id} className='student-row'>
                    <td> <img className='student-profile-pic' alt='student profile pic' src={student.imageURL}/> </td>
                    <td> <p>{student.fullName}</p> </td>
                    <td> <p>{student.phone}</p> </td>
                    <td> <p>{student.email}</p> </td>
                    <td> <p>{getCourseName(student.courseId)}</p> </td> {/* Get the course name using helper function */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  );
};

export default Students;
