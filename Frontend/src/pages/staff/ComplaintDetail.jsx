import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComplaint } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import Timeline from '../../components/Timeline';
import Spinner from '../../components/Spinner';
import { useToast } from '../../components/Toast';

const StaffComplaintDetail = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await getComplaint(id);
      setComplaint(response.data);
    } catch (error) {
      showError('Failed to fetch complaint details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">Complaint not found</p>
          <Link to="/staff/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const latestNote = complaint.statusHistory?.length
    ? [...complaint.statusHistory].sort(
        (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
      )[0]?.note
    : '';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4">
        <Link to="/staff/dashboard" className="text-blue-600 hover:text-blue-800">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{complaint.title}</h1>
          <StatusBadge status={complaint.status} />
        </div>

        <div className="flex gap-2 mb-4">
          <CategoryBadge category={complaint.category} />
          <PriorityBadge priority={complaint.priority} />
        </div>

        <div className="border-t pt-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{complaint.description}</p>
        </div>

        <div className="border-t pt-4 mb-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Latest Note</h2>
          <textarea
            readOnly
            value={latestNote || 'No notes yet.'}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
          />
        </div>

        <Link
          to={`/staff/update-status/${complaint.id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          Update Status
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Status History</h2>
        <Timeline history={complaint.statusHistory} />
      </div>
    </div>
  );
};

export default StaffComplaintDetail;
