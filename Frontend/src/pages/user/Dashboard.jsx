import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserComplaints } from '../../services/api';
import ComplaintCard from '../../components/ComplaintCard';
import Spinner from '../../components/Spinner';
import { useToast } from '../../components/Toast';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await getUserComplaints();
      setComplaints(response.data);
    } catch (error) {
      showError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Complaints</h1>
        <Link
          to="/complaints/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          + New Complaint
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">You haven't filed any complaints yet.</p>
          <Link
            to="/complaints/new"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            File Your First Complaint
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;