import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='homeContainer'>
        <div className='homeMainContainer'>
            <h1>Welcome to To Do Board</h1>
            <p>Please login to continue</p>
            <Link to="/login"><button>Login</button></Link>
        </div>
    </div>
  )
}

export default Home