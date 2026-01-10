/**
 * Size Recommendation System
 * Estimates clothing size based on gender, age, weight, height, and body measurements
 */

/**
 * Calculate recommended size for clothing based on measurements
 * @param {Object} measurements - User measurements
 * @param {string} measurements.gender - 'male', 'female', 'other'
 * @param {number} measurements.age - Age in years
 * @param {number} measurements.weight - Weight in kg
 * @param {number} measurements.height - Height in cm
 * @param {number} [measurements.chest] - Chest measurement in cm
 * @param {number} [measurements.waist] - Waist measurement in cm
 * @param {number} [measurements.hips] - Hips measurement in cm
 * @param {string} category - Product category (T-Shirts, Jeans, Hoodies, etc.)
 * @returns {string} Recommended size (S, M, L, XL, XXL or numeric sizes)
 */
export const recommendSize = (measurements, category) => {
  const { gender, age, weight, height, chest, waist, hips } = measurements;
  
  if (!gender || !weight || !height) {
    return null;
  }

  // Calculate BMI for reference
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  // Size calculation based on category
  let recommendedSize = null;

  if (category === 'Jeans' || category === 'Pants') {
    // For jeans/pants, use waist measurement or estimate from weight/height
    if (waist) {
      recommendedSize = getJeansSizeFromWaist(waist, gender);
    } else {
      recommendedSize = estimateJeansSize(weight, height, waist, gender);
    }
  } else if (category === 'Shoes') {
    // Shoe size calculation (US sizing)
    const footLength = estimateFootLength(height, gender);
    recommendedSize = getShoeSize(footLength, gender);
  } else {
    // For tops (T-Shirts, Hoodies, Jackets), use chest/weight/height
    if (chest) {
      recommendedSize = getTopSizeFromChest(chest, gender);
    } else {
      recommendedSize = estimateTopSize(weight, height, chest, bmi, gender, age);
    }
  }

  return recommendedSize;
};

/**
 * Estimate jeans size from waist measurement
 */
const getJeansSizeFromWaist = (waist, gender) => {
  if (gender === 'male') {
    if (waist < 76) return '28';
    if (waist < 81) return '30';
    if (waist < 86) return '32';
    if (waist < 91) return '34';
    if (waist < 96) return '36';
    if (waist < 101) return '38';
    if (waist < 106) return '40';
    return '42';
  } else {
    // Female sizing
    if (waist < 66) return '24';
    if (waist < 71) return '26';
    if (waist < 76) return '28';
    if (waist < 81) return '30';
    if (waist < 86) return '32';
    if (waist < 91) return '34';
    return '36';
  }
};

/**
 * Estimate jeans size from weight and height
 */
const estimateJeansSize = (weight, height, waist, gender) => {
  // Rough estimation based on BMI and gender
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let estimatedWaist;
  if (gender === 'male') {
    estimatedWaist = 70 + (bmi - 20) * 2.5;
  } else {
    estimatedWaist = 65 + (bmi - 20) * 2.0;
  }
  
  return getJeansSizeFromWaist(estimatedWaist, gender);
};

/**
 * Estimate top size from chest measurement
 */
const getTopSizeFromChest = (chest, gender) => {
  if (gender === 'male') {
    if (chest < 92) return 'S';
    if (chest < 100) return 'M';
    if (chest < 108) return 'L';
    if (chest < 116) return 'XL';
    if (chest < 124) return 'XXL';
    return 'XXXL';
  } else {
    // Female sizing
    if (chest < 86) return 'S';
    if (chest < 94) return 'M';
    if (chest < 102) return 'L';
    if (chest < 110) return 'XL';
    if (chest < 118) return 'XXL';
    return 'XXXL';
  }
};

/**
 * Estimate top size from weight, height, and BMI
 */
const estimateTopSize = (weight, height, chest, bmi, gender, age) => {
  // Age-adjusted estimation (younger people tend to have different body proportions)
  let ageFactor = 1;
  if (age && age < 25) ageFactor = 0.95;
  if (age && age > 50) ageFactor = 1.05;

  // Estimate chest from BMI and height
  let estimatedChest;
  if (gender === 'male') {
    estimatedChest = 85 + (bmi - 22) * 3 * ageFactor;
  } else {
    estimatedChest = 80 + (bmi - 21) * 2.5 * ageFactor;
  }

  // Use weight as additional factor
  if (gender === 'male') {
    if (weight < 60) estimatedChest -= 5;
    if (weight > 90) estimatedChest += 5;
  } else {
    if (weight < 50) estimatedChest -= 5;
    if (weight > 80) estimatedChest += 5;
  }

  return getTopSizeFromChest(estimatedChest, gender);
};

/**
 * Estimate foot length from height
 */
const estimateFootLength = (height, gender) => {
  // Rough estimation: foot length is approximately 15% of height
  let footLength = height * 0.15;
  
  // Gender adjustments
  if (gender === 'male') {
    footLength = footLength * 1.05; // Males typically have slightly longer feet
  } else {
    footLength = footLength * 0.95;
  }
  
  return footLength;
};

/**
 * Convert foot length to US shoe size
 */
const getShoeSize = (footLength, gender) => {
  // Convert cm to inches
  const footLengthInches = footLength / 2.54;
  
  if (gender === 'male') {
    // US Men's sizing
    const size = (footLengthInches - 7.67) * 3 + 1;
    return Math.round(size * 2) / 2; // Round to nearest 0.5
  } else {
    // US Women's sizing
    const size = (footLengthInches - 7.67) * 3 - 1.5;
    return Math.round(size * 2) / 2; // Round to nearest 0.5
  }
};

/**
 * Get size recommendation message
 */
export const getSizeRecommendationMessage = (measurements, category, recommendedSize, availableSizes) => {
  if (!recommendedSize) {
    return "I need more information (gender, weight, height) to recommend a size. Would you like to provide your measurements?";
  }

  const isAvailable = availableSizes && availableSizes.includes(recommendedSize);
  
  let message = `Based on your measurements`;
  if (measurements.age) message += ` (${measurements.gender}, ${measurements.age} years)`;
  message += `, I recommend size **${recommendedSize}** for ${category}.`;
  
  if (isAvailable) {
    message += ` ✅ This size is available!`;
  } else if (availableSizes) {
    // Find closest available size
    const closestSize = findClosestSize(recommendedSize, availableSizes);
    if (closestSize) {
      message += ` However, size ${recommendedSize} is not available. The closest available size is **${closestSize}**.`;
    } else {
      message += ` Unfortunately, this size is not currently available.`;
    }
  }

  return message;
};

/**
 * Find closest available size
 */
const findClosestSize = (targetSize, availableSizes) => {
  if (!availableSizes || availableSizes.length === 0) return null;
  
  // Size order mapping
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const numericSizes = availableSizes.filter(s => /^\d+$/.test(s)).map(s => parseInt(s)).sort((a, b) => a - b);
  
  // If target is numeric (jeans), find closest numeric size
  if (/^\d+$/.test(targetSize)) {
    const targetNum = parseInt(targetSize);
    if (numericSizes.length > 0) {
      return numericSizes.reduce((prev, curr) => 
        Math.abs(curr - targetNum) < Math.abs(prev - targetNum) ? curr : prev
      ).toString();
    }
  }
  
  // For letter sizes, find closest in order
  const targetIndex = sizeOrder.indexOf(targetSize);
  if (targetIndex === -1) return availableSizes[0];
  
  // Check sizes in order of proximity
  for (let offset = 0; offset < sizeOrder.length; offset++) {
    const checkSize = sizeOrder[targetIndex + offset];
    if (checkSize && availableSizes.includes(checkSize)) return checkSize;
    
    const checkSizeBefore = sizeOrder[targetIndex - offset];
    if (checkSizeBefore && availableSizes.includes(checkSizeBefore)) return checkSizeBefore;
  }
  
  return availableSizes[0];
};
