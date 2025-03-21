import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
  GeoPoint
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { useAuth } from './AuthContext';

const ProductsContext = createContext();

export function useProducts() {
  return useContext(ProductsContext);
}

export function ProductsProvider({ children }) {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          orderBy("createdAt", "desc")
        );

        unsubscribe = onSnapshot(q, (snapshot) => {
          const productList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProducts(productList);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addProduct = async (productData, images) => {
    try {
      const imageUrls = [];
      
      // Upload images if any
      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const storageRef = ref(storage, `products/${currentUser.uid}/${Date.now()}_${image.name}`);
          const uploadTask = uploadBytesResumable(storageRef, image);
          
          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // Track upload progress if needed
              },
              (error) => {
                reject(error);
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref)
                  .then(url => {
                    imageUrls.push(url);
                    resolve();
                  })
                  .catch(reject);
              }
            );
          });
        }
      }

      // Convert location to GeoPoint if provided
      let geoLocation = null;
      if (productData.latitude && productData.longitude) {
        geoLocation = new GeoPoint(
          parseFloat(productData.latitude), 
          parseFloat(productData.longitude)
        );
      }
      
      // Add product to Firestore
      const productRef = await addDoc(collection(db, "products"), {
        ...productData,
        sellerId: currentUser.uid,
        sellerName: currentUser.displayName,
        imageUrls,
        location: geoLocation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "available"
      });
      
      return productRef.id;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error getting product:", error);
      throw error;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  };

  const getProductsByUserId = async (userId) => {
    try {
      const q = query(collection(db, "products"), where("sellerId", "==", userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting user products:", error);
      throw error;
    }
  };

  const searchProducts = async (searchTerm, category, maxPrice) => {
    try {
      // In a real implementation, we'd use Firestore's complex queries or a dedicated search service
      // This is a simple implementation for demo purposes
      let filteredProducts = [...products];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(
          p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
        );
      }
      
      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseInt(maxPrice));
      }
      
      return filteredProducts;
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  };

  const value = {
    products,
    loading,
    addProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getProductsByUserId,
    searchProducts
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}
