import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div className="task-card" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3><bold>Title </bold>: {task.title}</h3>
      <h4>User : {task.authorname}</h4>
      <p><bold>Description:</bold> {task.description}</p>
      <h4>Priority:{task.priority}</h4>
    </div>
  );
}