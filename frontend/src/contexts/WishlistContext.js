import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export function WishlistProvider({ children }) {
  const { user, token } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Helper to load wishlist from localStorage for anonymous users
  const loadLocalWishlist = () => {
    try{
      const local = JSON.parse(localStorage.getItem('cs_wishlist')) || [];
      setWishlist(local);
    }catch(e){ setWishlist([]); }
  };

  // Save local wishlist
  const saveLocalWishlist = (items) => {
    try{ localStorage.setItem('cs_wishlist', JSON.stringify(items)); }catch(e){}
    setWishlist(items);
  };

  // Load wishlist on mount or when auth changes
  useEffect(() => {
    if (user && token) {
      api.get('/wishlist')
        .then(res => setWishlist(res.data))
        .catch(() => loadLocalWishlist());
    } else {
      loadLocalWishlist();
    }
  }, [user, token]);

  // Add to wishlist (accepts product object or productId)
  const addToWishlist = async (productOrId) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId?._id;

    if (user && token) {
      try {
        await api.post(`/wishlist/${id}`);
        const res = await api.get('/wishlist');
        setWishlist(res.data);
      } catch (err) {
        console.error('Add to wishlist error:', err);
      }
    } else {
      // anonymous: store product object in local storage if provided, otherwise just id
      try{
        const current = JSON.parse(localStorage.getItem('cs_wishlist')) || [];
        // If we have a full product object
        if (typeof productOrId === 'object' && productOrId?._id) {
          if (!current.some(i => i._id === productOrId._id)) {
            const next = [...current, productOrId];
            saveLocalWishlist(next);
          }
        } else if (id) {
          if (!current.some(i => i._id === id)) {
            const next = [...current, { _id: id }];
            saveLocalWishlist(next);
          }
        }
      }catch(err){ console.error('Local wishlist add error', err); }
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (user && token) {
      try {
        await api.delete(`/wishlist/${productId}`);
        // refetch
        const res = await api.get('/wishlist');
        setWishlist(res.data);
      } catch (err) {
        console.error('Remove from wishlist error:', err);
      }
    } else {
      try{
        const current = JSON.parse(localStorage.getItem('cs_wishlist')) || [];
        const next = current.filter(item => item._id !== productId);
        saveLocalWishlist(next);
      }catch(err){ console.error('Local wishlist remove error', err); }
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}