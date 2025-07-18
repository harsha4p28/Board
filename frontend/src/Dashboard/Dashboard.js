import React, { useState, useEffect } from 'react';
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
} from '@dnd-kit/sortable';
import TaskCard from '../Taskcard/Taskcard';
import Column from '../Column/Column';

const columns = ['ToDo', 'In Progress', 'Done'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://31ec9935-6b8d-464c-84b7-ee91541cce62-00-2okr80w4xnq04.pike.replit.dev:5000/getTasks', {
          method: 'GET',
          credentials: 'include', 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleForm = () => {
    navigate('/addTask');
  };

  const handleDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t._id === active.id);
    const updatedTask = { ...activeTask, status: over.id };

    setTasks((prev) =>
      prev.map((t) => (t._id === active.id ? updatedTask : t))
    );

    try {
      await fetch(`/updateTaskStatus/${active.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: over.id }),
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
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
        <button className="add-task-button" onClick={handleForm}>
          + Add Task
        </button>
      </div>
    </div>
  );
}
