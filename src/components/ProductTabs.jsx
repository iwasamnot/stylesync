const ProductTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New Arrivals' },
    { id: 'trending', label: 'Trending' },
    { id: 'sale', label: 'Sale' },
  ];

  return (
    <div className="mb-12 border-b border-gray-200 dark:border-gray-800">
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative pb-4 text-xs uppercase tracking-widest font-light transition-colors
              ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductTabs;

