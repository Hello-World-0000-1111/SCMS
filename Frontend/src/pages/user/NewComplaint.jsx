import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../services/api';
import { useToast } from '../../components/Toast';
import Spinner from '../../components/Spinner';

const NewComplaint = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'MEDIUM',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const categories = ['TECHNICAL', 'BILLING', 'HR', 'FACILITIES'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH'];

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description || formData.description.trim().length === 0) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createComplaint(formData);
      showSuccess('Complaint submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">File New Complaint</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Brief summary of your complaint"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Provide detailed information about your complaint"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${
              errors.category ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <div className="space-y-2">
            {priorities.map((priority) => (
              <label key={priority} className="flex items-center">
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className={`px-3 py-1 rounded text-sm ${
                  priority === 'LOW' ? 'bg-green-100 text-green-800' :
                  priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" /> : 'Submit Complaint'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewComplaint;