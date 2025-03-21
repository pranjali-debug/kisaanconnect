import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const notificationList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setNotifications(notificationList);
          setUnreadCount(notificationList.filter(notification => !notification.read).length);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    const unsubscribe = fetchNotifications();
    
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUser]);

  const addNotification = async (data) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      
      const notificationData = {
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        read: false,
        ...data
      };
      
      await addDoc(collection(db, "notifications"), notificationData);
      return true;
    } catch (error) {
      console.error("Error adding notification:", error);
      throw error;
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      
      const notificationRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
      
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!currentUser) throw new Error("User not authenticated");

      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      // Update each unread notification
      for (const notification of unreadNotifications) {
        const notificationRef = doc(db, "notifications", notification.id);
        await updateDoc(notificationRef, { read: true });
      }
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      
      await deleteDoc(doc(db, "notifications", notificationId));
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      const wasUnread = deletedNotification && !deletedNotification.read;
      
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      if (wasUnread) {
        setUnreadCount(prevCount => (prevCount > 0 ? prevCount - 1 : 0));
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
