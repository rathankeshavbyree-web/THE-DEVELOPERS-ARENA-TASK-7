import React, { useState, useEffect } from 'react';

function TaskItem({ task, onDelete, onStatusChange, onProgressChange, onEdit, isDarkMode }) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const endTime = new Date(task.endTime);
      const diff = endTime - now;

      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining('DEADLINE PASSED');
        return;
      }

      if (task.status === 'completed') {
        setTimeRemaining('TASK COMPLETED');
        setIsExpired(false);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(
        `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`
      );
      setIsExpired(false);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [task.endTime, task.status]);

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, newStatus);
  };

  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value, 10);
    onProgressChange(task.id, newProgress);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'inprogress':
        return 'inprogress';
      case 'pending':
      default:
        return 'pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={`task-item ${`high-priority` === `${task.priority}-priority` ? 'high-priority' : ''}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-status-badge ${getStatusClass(task.status)}`}>
          <i
            className={`bi ${
              task.status === 'completed'
                ? 'bi-check-circle-fill'
                : task.status === 'inprogress'
                ? 'bi-arrow-repeat'
                : 'bi-clock'
            }`}
            style={{ marginRight: '5px' }}
          ></i>
          {task.status === 'completed' ? 'COMPLETED' : task.status === 'inprogress' ? 'IN PROGRESS' : 'PENDING'}
        </span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <div className="meta-item">
          <i className="bi bi-calendar-event"></i>
          <span>{formatDate(task.startTime)}</span>
        </div>
        <div className="meta-item">
          <i className="bi bi-flag-fill"></i>
          <span>{formatDate(task.endTime)}</span>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <span className={`task-priority ${getPriorityClass(task.priority)}`}>
          <i className="bi bi-exclamation-diamond" style={{ marginRight: '5px' }}></i>
          {task.priority.toUpperCase()} PRIORITY
        </span>
      </div>

      <div className="countdown-timer">
        <div className={`countdown-time ${isExpired ? 'countdown-expired' : task.status === 'completed' ? 'countdown-completed' : ''}`}>
          <i className="bi bi-hourglass-split" style={{ marginRight: '8px' }}></i>
          {timeRemaining}
        </div>
        <div className="countdown-label">Remaining Time</div>
      </div>

      <div className="progress-section">
        <div className="progress-label">
          <span>Task Progress</span>
          <span className="progress-label-value">{task.progress}%</span>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-bar-inner" style={{ width: `${task.progress}%` }}></div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={task.progress}
          onChange={handleProgressChange}
          className="tactical-input"
          style={{ width: '100%', marginTop: '10px', cursor: 'pointer' }}
        />
      </div>

      <div className="task-actions">
        <button
          className={`task-btn ${task.status === 'completed' ? 'complete' : ''}`}
          onClick={handleStatusToggle}
          title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
        >
          <i className={`bi ${task.status === 'completed' ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
          {task.status === 'completed' ? 'UNDO' : 'COMPLETE'}
        </button>

        <button
          className="task-btn"
          onClick={() => onEdit(task)}
          title="Edit Task"
        >
          <i className="bi bi-pencil-square"></i>
          EDIT
        </button>

        <button
          className="task-btn delete"
          onClick={() => onDelete(task.id)}
          title="Delete Task"
        >
          <i className="bi bi-trash3"></i>
          DELETE
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
