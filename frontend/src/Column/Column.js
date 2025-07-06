import React from 'react';

export default function Column({ title, children, id }) {
  return (
    <div className="column" id={id}>
      <h3>{title}</h3>
      <div className="task-list">{children}</div>
    </div>
  );
}