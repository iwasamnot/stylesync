import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    gender: '',
    age: '',
    weight: '',
    height: '',
    chest: '',
    waist: '',
    hips: '',
    preferredSize: '',
    preferredCategories: [],
    priceRange: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    } else {
      // Load from localStorage if not logged in
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (error) {
          console.error('Error loading profile from localStorage:', error);
        }
      }
      setLoading(false);
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      if (!currentUser) return;

      const profileDoc = await getDoc(doc(db, 'userProfiles', currentUser.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data());
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(newProfile));

    // Save to Firestore if logged in
    if (currentUser) {
      try {
        await setDoc(doc(db, 'userProfiles', currentUser.uid), newProfile, { merge: true });
      } catch (error) {
        console.error('Error saving profile to Firestore:', error);
      }
    }
  };

  const clearProfile = () => {
    setProfile({
      gender: '',
      age: '',
      weight: '',
      height: '',
      chest: '',
      waist: '',
      hips: '',
      preferredSize: '',
      preferredCategories: [],
      priceRange: '',
    });
    localStorage.removeItem('userProfile');
  };

  const value = {
    profile,
    loading,
    updateProfile,
    clearProfile,
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
