import React from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home'; // Import the respective components
import Courses from './components/Courses';
import AddCourses from './components/AddCourses';
import Students from './components/Students';
import AddStudents from './components/AddStudents';
import FeeCollected from './components/FeeCollected';
import PaymentHistory from './components/PaymentHistory';
import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  // Creating the routing paths...
  const myRouter = createBrowserRouter([
    { path: '/', element: <Login /> }, // Default route (base URL)
    { path: '/login', element: <Login /> }, // Login route
    { path: '/signup', element: <Signup /> }, // Signup route
    {
      path: '/dashboard',
      element: <Dashboard />,
      children: [
        { path: '', element: <Home /> },
        { path: 'home', element: <Home /> },
        { path: 'All-Courses', element: <Courses /> },
        { path: 'Add-Courses', element: <AddCourses /> },
        { path: 'All-Students', element: <Students /> },
        { path: 'Add-Students', element: <AddStudents /> },
        { path: 'Fee-Collected', element: <FeeCollected /> },
        { path: 'Payment-History', element: <PaymentHistory /> },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={myRouter} />
      <ToastContainer />
    </>
  );
};

export default App;
