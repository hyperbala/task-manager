"use client";
import { useState ,useEffect} from "react";
import { X, Plus, Flag, Calendar, Tag, FileText, CheckSquare } from "lucide-react";

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSubmit,     // same for add or update
  mode = "add", // or "edit"
  task = {}     // existing task when editing
}) {

  const [title, setTitle] = useState(task?.title || "");
const [description, setDescription] = useState(task?.description || "");
const [status, setStatus] = useState(task?.status || "Pending");
const [isImportant, setIsImportant] = useState(task?.isImportant || false);
const [category, setCategory] = useState(task?.category || "General");

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "Pending");
      setIsImportant(task.isImportant || false);
      setCategory(task.category || "General");
    }
  }, [task, mode]);


  const categoryOptions = [
    { value: "General", label: "General", color: "bg-gray-100 text-gray-800" },
    { value: "Work", label: "Work", color: "bg-blue-100 text-blue-800" },
    { value: "Personal", label: "Personal", color: "bg-green-100 text-green-800" },
    { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
    { value: "Meeting", label: "Meeting", color: "bg-purple-100 text-purple-800" },
    { value: "Project", label: "Project", color: "bg-indigo-100 text-indigo-800" },
  ];

  if (!isOpen) return null;

  function handleSubmit(e) {
  e.preventDefault();
  if (!title.trim() || !description.trim()) return;

  onSubmit({
    ...task, // pass task._id if editing
    title: title.trim(),
    description: description.trim(),
    status,
    isImportant,
    category,
  });

  // Reset only if adding
  if (mode === "add") {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setIsImportant(false);
    setCategory("General");
  }
}


  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div 
  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-fadeIn"
  onClick={handleOverlayClick}
>
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-slideUp">
        {/* Header with Gradient */}
{/* Header without Gradient and with reduced height */}
<div className="relative bg-gray-100 text-gray-800 p-5">
  <div className="absolute top-4 right-4">
    <button
      onClick={onClose}
      className="relative p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110"
    >
      <X className="h-5 w-5" />
    </button>
  </div>

  <div className="relative flex items-center space-x-3">
    <div className="bg-white/70 p-3 rounded-2xl backdrop-blur-sm">
      <Plus className="h-6 w-6 text-indigo-600" />
    </div>
    <div>
      <h2 className="text-xl font-semibold">
  {mode === "edit" ? "Edit Task" : "Create New Task"}
</h2>
<p className="text-gray-600 text-sm">
  {mode === "edit" ? "Update your task details" : "Add a new task to your workflow"}
</p>

    </div>
  </div>
</div>


        {/* Form Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <CheckSquare className="h-4 w-4 text-indigo-500" />
                <span>Task Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter task title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white"
                required
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <FileText className="h-4 w-4 text-indigo-500" />
                <span>Description</span>
              </label>
              <textarea
                placeholder="Describe your task..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white resize-none"
                required
              />
            </div>

            {/* Status and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Select */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span>Status</span>
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
                >
                  <option value="Pending">Pending</option>
                  <option value="Done">Completed</option>
                </select>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  <span>Category</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 outline-none bg-gray-50/50 hover:bg-white appearance-none cursor-pointer"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Important Toggle */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                <Flag className="h-4 w-4 text-indigo-500" />
                <span>Priority</span>
              </label>
              <div 
                onClick={() => setIsImportant(!isImportant)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isImportant 
                    ? 'border-red-300 bg-red-50 hover:bg-red-100' 
                    : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isImportant 
                      ? 'border-red-500 bg-red-500' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isImportant && <Flag className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`font-medium ${isImportant ? 'text-red-700' : 'text-gray-600'}`}>
                    Mark as Important
                  </span>
                </div>
                {isImportant && (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                    HIGH PRIORITY
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:ring-4 focus:ring-gray-200 outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !description.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-indigo-500/30 outline-none transform hover:scale-105 disabled:hover:scale-100"
            >{mode === "edit" ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`

      
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}