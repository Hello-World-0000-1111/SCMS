import StatusBadge from './StatusBadge';

const Timeline = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return <p className="text-gray-500 text-sm">No status history available.</p>;
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
  );

  return (
    <div className="space-y-4">
      {sortedHistory.map((entry, index) => (
        <div key={entry.id || index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            {index < sortedHistory.length - 1 && (
              <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={entry.status} />
              <span className="text-xs text-gray-400">
                {new Date(entry.changedAt).toLocaleString()}
              </span>
            </div>
            {entry.note && (
              <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
            )}
            {entry.changedBy && (
              <p className="text-xs text-gray-400 mt-1">
                By: {entry.changedBy.name || entry.changedBy}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
