import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import TaskCard from '../Taskcard/Taskcard';
import Column from '../Column/Column';
import TaskForm from '../TaskForm/TaskForm';


const columns = ['Todo', 'In Progress', 'Done'];

export default function Dashboard() {

  const navigate=useNavigate();
  const [tasks, setTasks] = useState([
    { _id: '1', title: 'Design UI', description: 'Make wireframes', status: 'Todo' },
    { _id: '2', title: 'Build Auth', description: 'JWT + bcrypt', status: 'In Progress' },
    { _id: '3', title: 'Deploy App', description: 'Vercel + Render', status: 'Done' },
  ]);

  const handleForm = () =>{
    <TaskForm tasks={tasks} setTasks={setTasks}/>
  }

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const updatedTask = { ...activeTask, status: over.id };

    setTasks((prev) =>
      prev.map((t) => (t._id === active.id ? updatedTask : t))
    );
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Kanban Board</h2>
      <div className="board">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {columns.map((column) => (
            <Column key={column} title={column} id={column}>
              <SortableContext
                items={tasks.filter((t) => t.status === column).map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                {tasks
                  .filter((task) => task.status === column)
                  .map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
              </SortableContext>
            </Column>
          ))}
        </DndContext>
      </div>
      <div className="add-task">
        <button className="add-task-button" onclick={handleForm} >+ Add Task</button>
      </div>
    </div>
  );
}