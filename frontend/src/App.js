import logo from './logo.svg';
import './App.css';
import Home from './Home/Home';
import Dashboard from "./Dashboard/Dashboard";
import Profile from "./Profile/Profile";
import Login from "./Login/Login";
import Register from "./Register/Register";
import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import TaskForm from './TaskForm/TaskForm';

function App() {
  const [userLoggedin, setUserLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://31ec9935-6b8d-464c-84b7-ee91541cce62-00-2okr80w4xnq04.pike.replit.dev:5000/me", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: 'include'
        });

        if (res.ok) {
          const data = await res.json();
          setUserLoggedin(true);
        } else if (res.status === 401) {
          const refreshRes = await fetch("https://31ec9935-6b8d-464c-84b7-ee91541cce62-00-2okr80w4xnq04.pike.replit.dev:5000/refresh", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: 'include'
          });

          if (refreshRes.ok) {
            setUserLoggedin(true);
          } else {
            setUserLoggedin(false);
          }
        } else {
          setUserLoggedin(false);
        }
      } catch (error) {
        console.error("Error: " + error);
        setUserLoggedin(false);
      } finally {
        setLoading(false);
      }
    };

    handleUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={userLoggedin ? <Dashboard /> : <Home />} />
        <Route path='/dashboard' element={userLoggedin ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path='/addTask' element={<TaskForm />} />
        <Route path='/profile' element={userLoggedin ? <Profile /> : <Navigate to="/login" />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login setUserLoggedin={setUserLoggedin} />} />
      </Routes>
    </div>
  );
}

export default App;
