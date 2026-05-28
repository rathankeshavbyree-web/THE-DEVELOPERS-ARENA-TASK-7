import React, { useState, useEffect } from 'react';

function TaskInput({ onAddTask, onEditTask, editingTask, onCancelEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingTask) {
      const startDateTime = new Date(editingTask.startTime);
      const endDateTime = new Date(editingTask.endTime);

      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        startDate: startDateTime.toISOString().split('T')[0],
        startTime: startDateTime.toTimeString().slice(0, 5),
        endDate: endDateTime.toISOString().split('T')[0],
        endTime: endDateTime.toTimeString().slice(0, 5),
      });
      setErrors({});
    }
  }, [editingTask]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startDate && formData.startTime && formData.endDate && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      status: editingTask ? editingTask.status : 'pending',
      progress: editingTask ? editingTask.progress : 0,
    };

    if (editingTask) {
      onEditTask(editingTask.id, taskData);
    } else {
      onAddTask(taskData);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <div className="task-input-section">
      <h2 style={{ color: '#d4af6a', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        <i className="bi bi-plus-circle" style={{ marginRight: '10px' }}></i>
        {editingTask ? 'Edit Task' : 'Create New Task'}
      </h2>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className={errors.title ? 'tactical-input is-invalid' : 'tactical-input'}
          />
          {errors.title && <small style={{ color: '#ff5252', marginTop: '5px' }}>{errors.title}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority Level *</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="tactical-input"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter detailed task description"
            className="tactical-input"
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label>Task Duration</label>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className={errors.startDate ? 'tactical-input is-invalid' : 'tactical-input'}
          />
          {errors.startDate && <small style={{ color: '#ff5252' }}>{errors.startDate}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time *</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={errors.startTime ? 'tactical-input is-invalid' : 'tactical-input'}
          />
          {errors.startTime && <small style={{ color: '#ff5252' }}>{errors.startTime}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className={errors.endDate ? 'tactical-input is-invalid' : 'tactical-input'}
          />
          {errors.endDate && <small style={{ color: '#ff5252' }}>{errors.endDate}</small>}
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time *</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={errors.endTime ? 'tactical-input is-invalid' : 'tactical-input'}
          />
          {errors.endTime && <small style={{ color: '#ff5252' }}>{errors.endTime}</small>}
        </div>

        <div className="form-actions">
          {editingTask && (
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <i className="bi bi-x-circle" style={{ marginRight: '5px' }}></i>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-submit">
            <i className="bi bi-check-circle" style={{ marginRight: '5px' }}></i>
            {editingTask ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskInput;
