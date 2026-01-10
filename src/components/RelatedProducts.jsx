import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ProductCard from './ProductCard';

const RelatedProducts = ({ currentProductId, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, category]);

  const fetchRelatedProducts = async () => {
    if (!category) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'products'),
        where('category', '==', category),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((product) => product.id !== currentProductId)
        .slice(0, 4);
      setRelatedProducts(products);
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || relatedProducts.length === 0) return null;

  return (
    <div className="border-t border-gray-200 dark:border-gray-800 pt-12 mt-16">
      <h2 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-8">
        Related Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;

