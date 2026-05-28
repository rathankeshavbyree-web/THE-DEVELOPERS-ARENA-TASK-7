import React, { useMemo } from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onStatusChange, onProgressChange, onEdit, filter, sortBy, searchQuery, isDarkMode }) {
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Apply status/priority filter
    if (filter !== 'all') {
      if (['completed', 'pending', 'inprogress'].includes(filter)) {
        result = result.filter((task) => task.status === filter);
      } else if (filter === 'high') {
        result = result.filter((task) => task.priority === 'high');
      } else if (filter === 'medium') {
        result = result.filter((task) => task.priority === 'medium');
      } else if (filter === 'low') {
        result = result.filter((task) => task.priority === 'low');
      }
    }

    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (sortBy === 'progress') {
      result.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    }

    return result;
  }, [tasks, filter, sortBy, searchQuery]);

  return (
    <div className="task-list-section">
      {filteredAndSortedTasks.length === 0 ? (
        <div className="empty-state">
          <i className="bi bi-inbox"></i>
          <h2>No Tasks Found</h2>
          <p>
            {searchQuery
              ? 'Try adjusting your search criteria'
              : filter !== 'all'
              ? 'No tasks in this category'
              : 'Create your first task to get started'}
          </p>
        </div>
      ) : (
        <div className="task-list">
          {filteredAndSortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onProgressChange={onProgressChange}
              onEdit={onEdit}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;
