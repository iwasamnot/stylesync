/**
 * Product Recommendation System
 * Recommends products based on user preferences, browsing history, and profile
 */

/**
 * Recommend products based on user preferences
 * @param {Array} allProducts - All available products
 * @param {Object} userProfile - User profile with preferences and measurements
 * @param {Array} recentlyViewed - Recently viewed products
 * @param {number} limit - Maximum number of recommendations
 * @returns {Array} Recommended products
 */
export const recommendProducts = (allProducts, userProfile = {}, recentlyViewed = [], limit = 8) => {
  if (!allProducts || allProducts.length === 0) return [];

  let recommendations = [...allProducts];

  // Filter by size availability if user has a preferred size
  if (userProfile.preferredSize) {
    recommendations = recommendations.filter(product => {
      if (!product.sizes || product.sizes.length === 0) return true;
      return product.sizes.includes(userProfile.preferredSize);
    });
  }

  // Score products based on various factors
  const scoredProducts = recommendations.map(product => {
    let score = 0;

    // Category preference
    if (userProfile.preferredCategories && userProfile.preferredCategories.includes(product.category)) {
      score += 10;
    }

    // Price range preference
    if (userProfile.priceRange) {
      const price = product.price || 0;
      switch (userProfile.priceRange) {
        case 'low':
          if (price < 50) score += 5;
          break;
        case 'medium':
          if (price >= 50 && price < 100) score += 5;
          break;
        case 'high':
          if (price >= 100) score += 5;
          break;
      }
    }

    // Trending products get a boost
    if (product.trending) score += 5;

    // On sale products get a boost
    if (product.onSale) score += 3;

    // New arrivals get a boost
    if (product.newArrival) score += 2;

    // Recently viewed category gets a boost
    if (recentlyViewed.length > 0) {
      const viewedCategories = recentlyViewed.map(p => p.category);
      if (viewedCategories.includes(product.category)) {
        score += 3;
      }
    }

    // Stock availability (prefer products in stock)
    if (product.stock > 0) score += 2;

    return { ...product, recommendationScore: score };
  });

  // Sort by score and return top recommendations
  return scoredProducts
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};

/**
 * Get personalized greeting message
 */
export const getPersonalizedGreeting = (userProfile) => {
  if (!userProfile || !userProfile.gender) {
    return "Hello! I'm your StyleSync AI assistant. I can help you find the perfect products and recommend sizes based on your measurements.";
  }

  const name = userProfile.name || '';
  const greetings = {
    male: name ? `Hi ${name}!` : "Hello!",
    female: name ? `Hi ${name}!` : "Hello!",
    other: name ? `Hi ${name}!` : "Hello!"
  };

  return `${greetings[userProfile.gender] || "Hello!"} I'm your StyleSync AI assistant. I can help you find the perfect products and recommend sizes based on your measurements.`;
};

/**
 * Generate product recommendation message
 */
export const getProductRecommendationMessage = (products, category = null) => {
  if (!products || products.length === 0) {
    return "I couldn't find products matching your preferences. Try adjusting your filters or let me know what you're looking for!";
  }

  let message = category 
    ? `I found ${products.length} great ${category.toLowerCase()} that might interest you:\n\n`
    : `I found ${products.length} products that match your preferences:\n\n`;

  products.slice(0, 5).forEach((product, index) => {
    message += `${index + 1}. **${product.name}**`;
    if (product.price) {
      message += product.onSale 
        ? ` - $${product.price.toFixed(2)} (on sale!)`
        : ` - $${product.price.toFixed(2)}`;
    }
    message += '\n';
  });

  if (products.length > 5) {
    message += `\nAnd ${products.length - 5} more...`;
  }

  return message;
};
