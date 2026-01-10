import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Logo className="w-8 h-8" />
              <h3 className="text-sm uppercase tracking-widest text-gray-900 dark:text-white font-light">StyleSync</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed">
              Timeless elegance. Modern sophistication.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-900 dark:text-white font-light mb-6">Shop</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light">All Products</Link>
              </li>
              <li>
                <Link to="/?tab=new" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light">New Arrivals</Link>
              </li>
              <li>
                <Link to="/?tab=trending" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light">Trending</Link>
              </li>
              <li>
                <Link to="/?tab=sale" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light">Sale</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-900 dark:text-white font-light mb-6">Customer Service</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <Link to="/cart" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors font-light">Wishlist</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-xs text-gray-500 dark:text-gray-400 font-light">
          <p>&copy; 2025 StyleSync. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

