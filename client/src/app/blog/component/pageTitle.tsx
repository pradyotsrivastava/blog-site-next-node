const PageTitle = ({ value, onChange }) => {
  return (
    <div className="w-full p-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter blog title..."
        className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default PageTitle;
