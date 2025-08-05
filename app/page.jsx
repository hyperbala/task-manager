'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TaskModal from '../components/AddTaskModal.jsx';
import DeleteConfirmationModal from '@/components/deleteModal.jsx';
import Navbar from '../components/Navbar.jsx';
import { Plus, Filter, Search, Calendar, User, Flag, CheckCircle, Clock, AlertCircle, Eye, Edit, Trash2 } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'All Tasks', color: 'text-gray-600' },
  { value: 'Pending', label: 'Pending', color: 'text-amber-600' },
  { value: 'Done', label: 'Completed', color: 'text-emerald-600' },
];

const categoryColors = {
  'Work': 'bg-blue-100 text-blue-800',
  'Personal': 'bg-green-100 text-green-800',
  'Urgent': 'bg-red-100 text-red-800',
  'Meeting': 'bg-purple-100 text-purple-800',
  'Default': 'bg-gray-100 text-gray-800'
};

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [taskToDelete, setTaskToDelete] = useState(null);
const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false); // to toggle edit modal
const [selectedTask, setSelectedTask] = useState(null);     // to store task being edited

  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
const tasksPerPage = 10;

// Reset to page 1 on filter or search change
useEffect(() => {
  setCurrentPage(1);
}, [statusFilter, searchTerm]);

// Pagination logic


  const { data: session, status } = useSession();
  const router = useRouter();
  

  function openModal() {
    setShowAddModal(true); 
  }
  
  function closeModal() {
    setShowAddModal(false);
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'Pending': return <Clock className="h-5 w-5 text-amber-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category) => {
    return categoryColors[category] || categoryColors['Default'];
  };


  const openDeleteModal = (task) => {
  setTaskToDelete(task);
  setIsDeleteModalOpen(true);
};

const closeDeleteModal = () => {
  setIsDeleteModalOpen(false);
  setTaskToDelete(null);
};

async function handleDelete() {
  try {
    const res = await fetch(`/api/tasks/${taskToDelete._id}`, { method: "DELETE" });
    if (res.ok) {
      fetchTasks();
      closeDeleteModal();
    } else {
      console.error("Failed to delete task");
    }
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}


  async function fetchTasks(selectedStatus = statusFilter) {
    try {
      let url = '/api/tasks';
      const params = [];
      if (selectedStatus) params.push(`status=${selectedStatus}`);
      if (params.length) url += `?${params.join('&')}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  }


  const handleUpdateTask = async (updatedTask) => {
  try {
    const res = await fetch(`/api/tasks/${updatedTask._id}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });


    if (!res.ok) throw new Error("Update failed");

    // Refresh or update task list in UI
    setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
    setShowEditModal(false);
  } catch (err) {
    console.error("Error updating task:", err);
  }
};

  
  async function addTask(task) {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (res.ok) {
        closeModal();
        fetchTasks();
      } else {
        console.error('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  useEffect(() => {
  async function loadTasks() {
    await fetchTasks();
  }
  loadTasks();
}, [statusFilter]);


  // Filter tasks based on search term and status
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesSearch = !searchTerm || 
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const paginatedTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  
const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);

  // While checking session, show nothing or a loader
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Task Management Dashboard
                </h1>
                <p className="text-gray-600">Organize your work efficiently and stay productive</p>
              </div>
              
              <button
                onClick={openModal}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Completed</p>
                <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'Done').length}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-emerald-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">Pending</p>
                <p className="text-3xl font-bold">{tasks.filter(t => t.status === 'Pending').length}</p>
              </div>
              <Clock className="h-12 w-12 text-amber-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Important</p>
                <p className="text-3xl font-bold">{tasks.filter(t => t.isImportant).length}</p>
              </div>
              <Flag className="h-12 w-12 text-red-200" />
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white min-w-[200px] transition-all"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {paginatedTasks.length === 0 ? (
            <div className="col-span-full">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          ) : (
            paginatedTasks.map((task) => (
              <div
                key={task._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.status)}
                    <span className={`text-sm font-medium ${
                      task.status === 'Done' ? 'text-emerald-600' :
                      task.status === 'Pending' ? 'text-amber-600' : 'text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  {task.isImportant && (
                    <div className="flex items-center space-x-1 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                      <Flag className="h-3 w-3" />
                      <span>Important</span>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                  {task.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {task.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                    {task.category}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {task.createdAt ? new Date(task.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      }) : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-500">{task.creator || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Eye className="h-4 w-4" />
                                    </button>
                                    
                    <button
                  onClick={() => {
                        setSelectedTask(task);
                        setShowEditModal(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => openDeleteModal(task)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>
                </div>
              </div>
            ))

            
          )}
          {totalPages > 1 && (
  <div className="flex justify-center mt-8 space-x-2">
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 rounded text-sm border font-medium transition-all ${
          currentPage === i + 1
            ? "bg-indigo-600 text-white"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        }`}
      >
        {i + 1}
      </button>
    ))}
  </div>
)}

        </div>
        <TaskModal
  isOpen={showAddModal}
  onClose={() => setShowAddModal(false)}
  onSubmit={addTask}
  mode="add"
/>

              <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
              />

              <TaskModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  onSubmit={handleUpdateTask}
  mode="edit"
  task={selectedTask}
/>



      </main>
    </div>
  );
}