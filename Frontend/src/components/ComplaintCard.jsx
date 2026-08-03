import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

const ComplaintCard = ({ complaint, linkPrefix = '/complaints' }) => {
  return (
    <Link to={`${linkPrefix}/${complaint.id}`} className="block">
      <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{complaint.title}</h3>
          <StatusBadge status={complaint.status} />
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{complaint.description}</p>

        <div className="flex gap-2 items-center">
          <CategoryBadge category={complaint.category} />
          <PriorityBadge priority={complaint.priority} />
        </div>

        {complaint.assignedTo && (
          <div className="mt-3 text-sm text-gray-500">
            Assigned to: {complaint.assignedTo.name}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-400">
          Created: {new Date(complaint.createdAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

export default ComplaintCard;
