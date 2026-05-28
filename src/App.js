import React, { useState, useEffect } from 'react';
import './App.css';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTasks = localStorage.getItem('appTasks');
      const savedTheme = localStorage.getItem('appTheme');
      const savedFilter = localStorage.getItem('appFilter');
      const savedSort = localStorage.getItem('appSort');

      if (savedTasks) {
        try {
          setTasks(JSON.parse(savedTasks));
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
      }

      if (savedTheme) {
        setIsDarkMode(JSON.parse(savedTheme));
      }

      if (savedFilter) {
        setFilter(savedFilter);
      }

      if (savedSort) {
        setSortBy(savedSort);
      }

      setIsLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('appTasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('appTheme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save filter preference
  useEffect(() => {
    localStorage.setItem('appFilter', JSON.stringify(filter));
  }, [filter]);

  // Save sort preference
  useEffect(() => {
    localStorage.setItem('appSort', JSON.stringify(sortBy));
  }, [sortBy]);

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const editTask = (taskId, updatedData) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, ...updatedData } : task))
    );
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    setShowDeleteConfirm(null);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          let newProgress = task.progress;
          if (newStatus === 'completed') {
            newProgress = 100;
          } else if (newStatus === 'pending') {
            newProgress = 0;
          }
          return {
            ...task,
            status: newStatus,
            progress: newProgress,
          };
        }
        return task;
      })
    );
  };

  const updateTaskProgress = (taskId, newProgress) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          let newStatus = task.status;
          if (newProgress === 100) {
            newStatus = 'completed';
          } else if (newProgress > 0 && newProgress < 100) {
            newStatus = 'inprogress';
          } else if (newProgress === 0) {
            newStatus = 'pending';
          }
          return {
            ...task,
            progress: newProgress,
            status: newStatus,
          };
        }
        return task;
      })
    );
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const getStatistics = () => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'inprogress').length;

    return { total, completed, pending, inProgress };
  };

  const stats = getStatistics();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="radar-container">
            <div className="radar-outer"></div>
            <div className="radar-middle"></div>
            <div className="radar-inner"></div>
            <div className="radar-sweep"></div>
            <div className="radar-center"></div>
          </div>

          <h1 className="loading-text">TASK DASHBOARD</h1>
          <p className="loading-subtext">Premium Task Management System</p>

          <div className="progress-bar-container">
            <div className="progress-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="app-title">
            <i className="bi bi-check2-square"></i>
            <h1>Task Manager</h1>
          </div>

          <div className="header-controls">
            <button
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <i className={`bi ${isDarkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Statistics Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-icon total">
              <i className="bi bi-list-task"></i>
            </div>
            <div className="stat-content">
              <h3>Total Tasks</h3>
              <p>{stats.total}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div className="stat-content">
              <h3>Completed</h3>
              <p>{stats.completed}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <i className="bi bi-exclamation-circle"></i>
            </div>
            <div className="stat-content">
              <h3>Pending</h3>
              <p>{stats.pending}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon inprogress">
              <i className="bi bi-arrow-repeat"></i>
            </div>
            <div className="stat-content">
              <h3>In Progress</h3>
              <p>{stats.inProgress}</p>
            </div>
          </div>
        </section>

        {/* Task Input Form */}
        <TaskInput
          onAddTask={addTask}
          onEditTask={editTask}
          editingTask={editingTask}
          onCancelEdit={handleCancelEdit}
        />

        {/* Controls Section */}
        <section className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="bi bi-search"></i>
          </div>

          <div className="filter-group">
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Tasks</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="sort-group">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="priority">Priority Wise</option>
              <option value="progress">Progress Wise</option>
              <option value="deadline">Deadline Wise</option>
            </select>
          </div>
        </section>

        {/* Task List */}
        <TaskList
          tasks={tasks}
          onDelete={(taskId) => setShowDeleteConfirm(taskId)}
          onStatusChange={updateTaskStatus}
          onProgressChange={updateTaskProgress}
          onEdit={handleEditTask}
          filter={filter}
          sortBy={sortBy}
          searchQuery={searchQuery}
          isDarkMode={isDarkMode}
        />
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="bi bi-exclamation-triangle" style={{ marginRight: '10px', color: '#ff5252' }}></i>
                Confirm Deletion
              </h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this task? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                className="modal-btn-cancel"
                onClick={() => setShowDeleteConfirm(null)}
              >
                <i className="bi bi-x-circle" style={{ marginRight: '5px' }}></i>
                Cancel
              </button>
              <button
                className="modal-btn-confirm"
                onClick={() => deleteTask(showDeleteConfirm)}
              >
                <i className="bi bi-trash3" style={{ marginRight: '5px' }}></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
