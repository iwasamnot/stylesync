const StatsSection = () => {
  const stats = [
    { label: 'Products', value: '500+' },
    { label: 'Customers', value: '10K+' },
    { label: 'Orders', value: '50K+' },
    { label: 'Countries', value: '50+' },
  ];

  return (
    <div className="border-t border-b border-gray-200 py-12 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-light text-gray-900 mb-2">{stat.value}</div>
            <div className="text-xs uppercase tracking-widest text-gray-500 font-light">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;

