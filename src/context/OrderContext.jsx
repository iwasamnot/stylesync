import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const OrderContext = createContext({});

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Load user orders
  const loadOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    setLoading(true);
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(ordersQuery);
      const ordersList = querySnapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || (data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()),
          updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()),
        };
      });
      setOrders(ordersList);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Create a new order
  const createOrder = useCallback(async (orderData) => {
    if (!currentUser) {
      throw new Error('User must be authenticated to create an order');
    }

    try {
      const order = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        items: orderData.items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentIntentId: orderData.paymentIntentId || null,
        total: orderData.total,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping || 0,
        tax: orderData.tax || 0,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), order);
      await loadOrders();
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [currentUser, loadOrders]);

  // Update order status (admin only, but users can cancel)
  const updateOrderStatus = useCallback(async (orderId, status, additionalData = {}) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
        ...additionalData,
      });
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }, [loadOrders]);

  // Cancel order (user)
  const cancelOrder = useCallback(async (orderId) => {
    if (!currentUser) {
      throw new Error('User must be authenticated');
    }

    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        throw new Error('Order not found');
      }

      const orderData = orderDoc.data();
      if (orderData.userId !== currentUser.uid) {
        throw new Error('Unauthorized');
      }

      if (orderData.status === 'cancelled' || orderData.status === 'completed' || orderData.status === 'shipped') {
        throw new Error(`Cannot cancel order with status: ${orderData.status}`);
      }

      await updateOrderStatus(orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }, [currentUser, updateOrderStatus]);

  // Get order by ID
  const getOrder = useCallback(async (orderId) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderDoc = await getDoc(orderRef);
      
      if (!orderDoc.exists()) {
        return null;
      }

      const orderData = orderDoc.data();
      if (orderData.userId !== currentUser?.uid && !currentUser?.isAdmin) {
        throw new Error('Unauthorized');
      }

      const data = orderDoc.data();
      return {
        id: orderDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || (data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date()),
        updatedAt: data.updatedAt?.toDate?.() || (data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date()),
      };
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }, [currentUser]);

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrder,
    loadOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
