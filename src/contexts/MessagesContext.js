import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const MessagesContext = createContext();

export function useMessages() {
  return useContext(MessagesContext);
}

export function MessagesProvider({ children }) {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      setMessages([]);
      setLoading(false);
      return;
    }

    // Fetch user's conversations
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "conversations"),
          where("participants", "array-contains", currentUser.uid),
          orderBy("lastMessageTime", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const conversationList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setConversations(conversationList);
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    const unsubscribeConversations = fetchConversations();
    
    return () => {
      if (unsubscribeConversations && typeof unsubscribeConversations === 'function') {
        unsubscribeConversations();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    if (!activeConversation || !currentUser) {
      setMessages([]);
      return;
    }

    // Fetch messages for active conversation
    const q = query(
      collection(db, "messages"),
      where("conversationId", "==", activeConversation.id),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });
    
    return unsubscribe;
  }, [activeConversation, currentUser]);

  const sendMessage = async (text, conversationId, receiverId) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      
      let actualConversationId = conversationId;
      
      // If no conversation exists, create one
      if (!actualConversationId) {
        const newConversation = await addDoc(collection(db, "conversations"), {
          participants: [currentUser.uid, receiverId],
          createdAt: serverTimestamp(),
          lastMessageTime: serverTimestamp(),
          lastMessage: text
        });
        
        actualConversationId = newConversation.id;
      }
      
      // Add message
      await addDoc(collection(db, "messages"), {
        conversationId: actualConversationId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        text,
        timestamp: serverTimestamp(),
        read: false
      });
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const getOrCreateConversation = async (otherUserId) => {
    try {
      if (!currentUser) throw new Error("User not authenticated");
      
      // Check if conversation already exists
      const q1 = query(
        collection(db, "conversations"),
        where("participants", "array-contains", currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q1);
      const existingConversation = querySnapshot.docs.find(doc => {
        const data = doc.data();
        return data.participants.includes(otherUserId);
      });
      
      if (existingConversation) {
        const convoData = {
          id: existingConversation.id,
          ...existingConversation.data()
        };
        setActiveConversation(convoData);
        return convoData;
      }
      
      // Create new conversation
      const newConversation = await addDoc(collection(db, "conversations"), {
        participants: [currentUser.uid, otherUserId],
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
        lastMessage: ""
      });
      
      const convoData = {
        id: newConversation.id,
        participants: [currentUser.uid, otherUserId],
        createdAt: new Date().toISOString(),
        lastMessageTime: new Date().toISOString(),
        lastMessage: ""
      };
      
      setActiveConversation(convoData);
      return convoData;
    } catch (error) {
      console.error("Error getting/creating conversation:", error);
      throw error;
    }
  };

  const value = {
    conversations,
    messages,
    loading,
    activeConversation,
    setActiveConversation,
    sendMessage,
    getOrCreateConversation
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
