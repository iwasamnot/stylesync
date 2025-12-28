import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductSort from '../components/ProductSort';
import SearchBar from '../components/SearchBar';
import ProductTabs from '../components/ProductTabs';
import LoadingSkeleton from '../components/LoadingSkeleton';
import HeroBanner from '../components/HeroBanner';
import PromoBanner from '../components/PromoBanner';
import CategoryShowcase from '../components/CategoryShowcase';
import StatsSection from '../components/StatsSection';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(() => searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update URL when tab or category changes
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('tab', activeTab);
    if (selectedCategory) params.set('category', selectedCategory);
    const newParams = params.toString();
    const currentParams = searchParams.toString();
    if (newParams !== currentParams) {
      setSearchParams(params, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllProducts(productsList);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [allProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Tab filter (Sale, Trending, New Arrivals)
    if (activeTab === 'sale') {
      filtered = filtered.filter((product) => product.onSale === true);
    } else if (activeTab === 'trending') {
      filtered = filtered.filter((product) => product.trending === true);
    } else if (activeTab === 'new') {
      filtered = filtered.filter((product) => product.newArrival === true);
    }
    // 'all' shows all products

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter((product) => {
        const price = product.price || 0;
        switch (priceRange) {
          case '0-50':
            return price >= 0 && price <= 50;
          case '50-100':
            return price > 50 && price <= 100;
          case '100-200':
            return price > 100 && price <= 200;
          case '200+':
            return price > 200;
          default:
            return true;
        }
      });
    }

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) => {
        const productSizes = product.sizes || [];
        return selectedSizes.some((size) => productSizes.includes(size));
      });
    }

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'name-asc':
          return (a.name || '').localeCompare(b.name || '');
        case 'name-desc':
          return (b.name || '').localeCompare(a.name || '');
        case 'newest':
        default:
          const aDate = new Date(a.createdAt || 0);
          const bDate = new Date(b.createdAt || 0);
          return bDate - aDate;
      }
    });

    return sorted;
  }, [allProducts, activeTab, searchQuery, selectedCategory, priceRange, selectedSizes, sortBy]);

  const handleSizeChange = (size, checked) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange('all');
    setSelectedSizes([]);
    setSortBy('newest');
    setActiveTab('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shop All Products</h1>
          <LoadingSkeleton count={8} />
        </div>
      </div>
    );
  }

  // Get featured products for different sections
  const featuredProducts = useMemo(() => {
    return {
      newArrivals: allProducts.filter(p => p.newArrival).slice(0, 4),
      trending: allProducts.filter(p => p.trending).slice(0, 4),
      onSale: allProducts.filter(p => p.onSale).slice(0, 4),
      bestsellers: allProducts.slice(0, 4),
    };
  }, [allProducts]);

  const showFeaturedSections = activeTab === 'all' && !searchQuery && !selectedCategory && priceRange === 'all' && selectedSizes.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner - Only show on "all" tab with no filters */}
        {showFeaturedSections && <HeroBanner />}

        {/* Stats Section */}
        {showFeaturedSections && <StatsSection />}

        {/* Category Showcase - Only show on "all" tab with no filters */}
        {showFeaturedSections && categories && categories.length > 0 && (
          <CategoryShowcase categories={categories} />
        )}

        {/* Promotional Banners */}
        {showFeaturedSections && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <PromoBanner
              title="Free Shipping"
              subtitle="On orders over $100"
              link="/?tab=sale"
              linkText="Shop Now"
              gradient="from-green-500 to-emerald-600"
            />
            <PromoBanner
              title="New Collection"
              subtitle="Check out our latest arrivals"
              link="/?tab=new"
              linkText="Explore"
              gradient="from-pink-500 to-rose-600"
            />
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {activeTab === 'all' ? 'Shop All Products' : 
             activeTab === 'new' ? 'New Arrivals' :
             activeTab === 'trending' ? 'Trending Now' :
             activeTab === 'sale' ? 'Sale Items' : 'Shop All Products'}
          </h1>
          
          {/* Product Tabs */}
          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Search Bar */}
          <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>

        {/* Featured Sections - Only show when viewing all products */}
        {showFeaturedSections && allProducts.length > 0 && (
          <>
            {featuredProducts.onSale.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-red-500">🏷️</span>
                    On Sale Now
                  </h2>
                  <Link
                    to="/?tab=sale"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredProducts.onSale.map((product, index) => (
                    <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featuredProducts.newArrivals.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-green-500">✨</span>
                    New Arrivals
                  </h2>
                  <Link
                    to="/?tab=new"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredProducts.newArrivals.map((product, index) => (
                    <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {featuredProducts.trending.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="text-orange-500">🔥</span>
                    Trending Now
                  </h2>
                  <Link
                    to="/?tab=trending"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors"
                  >
                    View All
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {featuredProducts.trending.map((product, index) => (
                    <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="my-12 border-t border-gray-200"></div>
          </>
        )}

        {/* Main Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedSizes={selectedSizes}
              onSizeChange={handleSizeChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {!showFeaturedSections && (
              <ProductSort
                sortBy={sortBy}
                onSortChange={setSortBy}
                productCount={filteredAndSortedProducts.length}
              />
            )}
            
            {showFeaturedSections && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">All Products</h2>
                <ProductSort
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  productCount={filteredAndSortedProducts.length}
                />
              </div>
            )}

            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 text-xl font-semibold mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredAndSortedProducts.map((product, index) => (
                  <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

