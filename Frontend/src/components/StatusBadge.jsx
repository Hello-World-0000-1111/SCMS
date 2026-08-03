const StatusBadge = ({ status }) => {
  const colorMap = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    RESOLVED: 'bg-green-100 text-green-800',
    CLOSED: 'bg-gray-100 text-gray-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[status] || 'bg-gray-100 text-gray-800'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
