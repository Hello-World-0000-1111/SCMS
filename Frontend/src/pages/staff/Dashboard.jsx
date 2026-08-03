import { useState, useEffect } from 'react';
import { getAssignedComplaints } from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import Spinner from '../../components/Spinner';
import { useToast } from '../../components/Toast';

const StaffDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await getAssignedComplaints();
      setComplaints(response.data);
    } catch (error) {
      showError('Failed to fetch assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Assigned Complaints</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No complaints assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              linkPrefix="/staff/complaints"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
