import React from 'react';
import './TaskForm.css';
import { useEffect, useState } from 'react';

const TaskForm = ({tasks,setTasks}) => {
  const [formData, setFormData]=useState({
    title:"",
    description:"",
    priority:"",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try{
      const res=await fetch("http://localhost:5000/addTask",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        credentials:'include',
        body:JSON.stringify(formData)
      })
      const data=await res.json();
      if(res.ok){
        setTasks([...tasks,data]);
      }else{
        console.error("Error adding task:",data.message);
      }
    }catch(error){
      console.error("Error adding task:",error);
      alert("Something went wrong. Please try later.");
    }
  }
  
  return (
    <div className='TaskFormContainer'>
      <div className='TaskFormMainContainer'>
        <h2>Add Task</h2>
          <form onSubmit={handleAddTask}>
            <label htmlFor="title">Title:</label>
            <input id="title" type="text" name="title" placeholder="Enter your Task Title" value={formData.title} onChange ={handleChange} required/>
            <label htmlFor="description">Description:</label>
            <input id="description" type="text" name="description" placeholder="Enter your Task Description" value={formData.description} onChange ={handleChange} required/>
            <label htmlFor="priority">Priority:</label>
            <input id="priority" type="number" name="priority" placeholder="Enter your Task Priority" value={formData.priority} onChange ={handleChange} required/>
          </form>
          <button className='closeButton'>Close</button>
          <button className='deleteButton'>Delete</button>
          <button className='updateButton'>Update</button>
          <button className='addButton' onClick={handleAddTask}>Add</button>
          <button className='cancelButton'>Cancel</button>
      </div>
    </div>
  )
}

export default TaskForm