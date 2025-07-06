import React from 'react';
import "./Navbar.css"
import { Link,useNavigate } from "react-router-dom";

const Navbar = () => {
  return (
    <div className='navBarComponent'>
        <div className='navBarMainComponent'>
            <div className='navTitle'>
                To Do Board
            </div>
            <div className='homeNav'>
                <Link to="/">Home</Link>
            </div>
            <div className='homeLogin'>
                <Link to="login"> Login </Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar