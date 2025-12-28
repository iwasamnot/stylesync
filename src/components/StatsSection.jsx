const StatsSection = () => {
  const stats = [
    { label: 'Products', value: '500+', icon: '🛍️' },
    { label: 'Happy Customers', value: '10K+', icon: '😊' },
    { label: 'Orders Delivered', value: '50K+', icon: '📦' },
    { label: 'Countries', value: '50+', icon: '🌍' },
  ];

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-12 shadow-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center text-white animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-white/90">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsSection;

