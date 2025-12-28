const ProductTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All Products', icon: '🛍️' },
    { id: 'new', label: 'New Arrivals', icon: '✨' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'sale', label: 'Sale', icon: '🏷️' },
  ];

  return (
    <div className="mb-8">
      <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2 border border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300
              ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-white rounded-full"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;

