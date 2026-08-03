import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaint, updateComplaintStatus } from '../../services/api';
import Spinner from '../../components/Spinner';
import { useToast } from '../../components/Toast';

const UpdateStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [status, setStatus] = useState('IN_PROGRESS');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  const statuses = ['IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await getComplaint(id);
      setComplaint(response.data);
      if (response.data.status && statuses.includes(response.data.status)) {
        setStatus(response.data.status);
      }
    } catch (error) {
      showError('Failed to fetch complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      showError('Please add a note');
      return;
    }

    setSubmitting(true);
    try {
      await updateComplaintStatus(id, status, note);
      showSuccess('Status updated successfully!');
      navigate(`/staff/complaints/${id}`);
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to update status');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Complaint Status</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{complaint?.title}</h2>
        <p className="text-gray-600">{complaint?.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status
          </label>
          <div className="space-y-2">
            {statuses.map((s) => (
              <label key={s} className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value={s}
                  checked={status === s}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-800">{s.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a note about this status change"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
          >
            {submitting ? <Spinner size="sm" /> : 'Update Status'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/staff/complaints/${id}`)}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStatus;
