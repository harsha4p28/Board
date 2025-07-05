import logo from './logo.svg';
import './App.css';
import Home from './Home/Home';
import Dashboard from "./Dashboard/Dashboard"
import Profile from "./Profile/Profile"
import Login from "./Login/Login"
import Register from "./Register/Register"
import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [userLoggedin, setUserLoggedin] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <div className="App">
       <Routes>
          <Route path='/' element={userLoggedin ? <Dashboard /> : <Home  />} />
          <Route path='/profile' element={<Profile />} ></Route>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path="*" element={<Navigate to='/' />} />
       </Routes>
    </div>
  );
}

export default App;
