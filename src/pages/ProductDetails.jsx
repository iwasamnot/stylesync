import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { calculateDiscount } from '../utils/helpers';
import WishlistButton from '../components/WishlistButton';
import ImageZoom from '../components/ImageZoom';
import SocialShare from '../components/SocialShare';
import ProductReviews from '../components/ProductReviews';
import RelatedProducts from '../components/RelatedProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (productDoc.exists()) {
        const productData = { id: productDoc.id, ...productDoc.data() };
        setProduct(productData);
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        // Add to recently viewed
        addToRecentlyViewed(productData);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock <= 0) {
      showToast('Product is out of stock!', 'error');
      return;
    }
    const itemToAdd = {
      ...product,
      selectedSize,
      selectedColor,
      quantity: quantity,
    };
    addToCart(itemToAdd);
    showToast(`${quantity} x ${product.name} added to cart!`, 'success');
  };

  const discount = product?.onSale && product?.originalPrice 
    ? calculateDiscount(product.originalPrice, product.price) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <ImageZoom
              src={product.image || 'https://via.placeholder.com/500'}
              alt={product.name}
            />
          </div>
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl font-light text-gray-900 dark:text-white mb-4 tracking-wide">
                  {product.name}
                </h1>
              </div>
              <div className="flex gap-2">
                <WishlistButton product={product} />
                <SocialShare product={product} />
              </div>
            </div>
            
            <div className="mb-6">
              {product.onSale && product.originalPrice && discount > 0 ? (
                <div>
                  <p className="text-2xl font-light text-gray-900 dark:text-white mb-1">
                    ${product.price?.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-light text-gray-900 dark:text-white">
                  ${product.price?.toFixed(2)}
                </p>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
                  Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
                  Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white"
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-light mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                >
                  -
                </button>
                <span className="text-sm text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="border border-gray-300 dark:border-gray-700 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                >
                  +
                </button>
                {product.stock > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {product.stock} in stock
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full border border-black dark:border-white text-black dark:text-white px-6 py-3 text-xs uppercase tracking-widest font-light hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProductId={id} category={product.category} />

        {/* Reviews */}
        <ProductReviews productId={id} />
      </div>
    </div>
  );
};

export default ProductDetails;

