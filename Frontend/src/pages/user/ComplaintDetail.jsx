import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getComplaint } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import CategoryBadge from '../../components/CategoryBadge';
import Timeline from '../../components/Timeline';
import Spinner from '../../components/Spinner';
import { useToast } from '../../components/Toast';

const UserComplaintDetail = () => {
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
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4">
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
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

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 text-gray-800">
              {new Date(complaint.createdAt).toLocaleString()}
            </span>
          </div>
          {complaint.assignedTo && (
            <div>
              <span className="text-gray-500">Assigned to:</span>
              <span className="ml-2 text-gray-800">{complaint.assignedTo.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Status History</h2>
        <Timeline history={complaint.statusHistory} />
      </div>
    </div>
  );
};

export default UserComplaintDetail;
