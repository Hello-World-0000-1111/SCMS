const CategoryBadge = ({ category }) => {
  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
      {category}
    </span>
  );
};

export default CategoryBadge;
