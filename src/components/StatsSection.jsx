const StatsSection = () => {
  const stats = [
    { label: 'Products', value: '500+' },
    { label: 'Customers', value: '10K+' },
    { label: 'Orders', value: '50K+' },
    { label: 'Countries', value: '50+' },
  ];

  return (
    <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-2xl font-light text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;

