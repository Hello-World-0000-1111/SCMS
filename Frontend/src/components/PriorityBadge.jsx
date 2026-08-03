const PriorityBadge = ({ priority }) => {
  const colorMap = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[priority] || 'bg-gray-100 text-gray-800'}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
