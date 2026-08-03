import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaint, getStaffMembers, assignComplaint } from '../../services/api';
import Spinner from '../../components/Spinner';
import { useToast } from '../../components/Toast';

const AssignComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [complaintRes, staffRes] = await Promise.all([
        getComplaint(id),
        getStaffMembers(),
      ]);
      setComplaint(complaintRes.data);
      setStaffMembers(staffRes.data);
      if (complaintRes.data.assignedTo) {
        setSelectedStaff(complaintRes.data.assignedTo.id.toString());
      }
    } catch (error) {
      showError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaff) {
      showError('Please select a staff member');
      return;
    }

    setSubmitting(true);
    try {
      await assignComplaint(id, selectedStaff);
      showSuccess('Complaint assigned successfully!');
      navigate('/admin/complaints');
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to assign complaint');
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assign Complaint</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{complaint.title}</h2>
        <p className="text-gray-600">{complaint.description}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label htmlFor="staff" className="block text-sm font-medium text-gray-700 mb-2">
            Select Staff Member
          </label>
          <select
            id="staff"
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Staff --</option>
            {staffMembers.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} ({staff.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
          >
            {submitting ? <Spinner size="sm" /> : 'Assign'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/complaints')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-md font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignComplaint;