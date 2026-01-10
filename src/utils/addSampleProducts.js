// Utility script to add sample products to Firestore
// Run this in browser console or create a temporary admin page

import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sampleProducts } from '../data/sampleProducts';

export const addSampleProductsToFirestore = async () => {
  try {
    console.log('Adding sample products to Firestore...');
    const promises = sampleProducts.map(async (product) => {
      const productData = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'products'), productData);
      console.log(`Added product: ${product.name} (ID: ${docRef.id})`);
      return docRef.id;
    });
    
    const ids = await Promise.all(promises);
    console.log(`Successfully added ${ids.length} products to Firestore!`);
    return ids;
  } catch (error) {
    console.error('Error adding products:', error);
    throw error;
  }
};

// To use this:
// 1. Import in a component or run in browser console
// 2. Call: addSampleProductsToFirestore()

