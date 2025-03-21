import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Button,
  Box,
  IconButton,
  Badge,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  SearchOutlined,
  MoreVert,
} from '@mui/icons-material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useMessages } from '../contexts/MessagesContext';
import { useAuth } from '../contexts/AuthContext';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const { conversations, messages, loading, activeConversation, setActiveConversation, sendMessage } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const [participantDetails, setParticipantDetails] = useState({});
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Parse URL parameters to get conversation ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const conversationId = params.get('conversation');
    
    if (conversationId) {
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
    } else if (conversations.length > 0 && !activeConversation) {
      // If no conversation is selected and there are conversations, select the first one
      setActiveConversation(conversations[0]);
    }
  }, [location.search, conversations, activeConversation, setActiveConversation]);

  // Fetch participant details for all conversations
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!currentUser || conversations.length === 0) return;
      
      setLoadingParticipants(true);
      const newParticipantDetails = { ...participantDetails };
      
      for (const conversation of conversations) {
        // Find the other participant's ID (not the current user)
        const otherParticipantId = conversation.participants.find(id => id !== currentUser.uid);
        
        // If we already have this participant's details or there is no other participant, skip
        if (newParticipantDetails[otherParticipantId] || !otherParticipantId) continue;
        
        try {
          const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
          if (userDoc.exists()) {
            newParticipantDetails[otherParticipantId] = userDoc.data();
          }
        } catch (error) {
          console.error('Error fetching participant details:', error);
        }
      }
      
      setParticipantDetails(newParticipantDetails);
      setLoadingParticipants(false);
    };

    fetchParticipants();
  }, [currentUser, conversations, participantDetails]);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      // Find the other participant's ID
      const otherParticipantId = activeConversation.participants.find(id => id !== currentUser.uid);
      
      if (!otherParticipantId) {
        console.error('Cannot find other participant');
        return;
      }
      
      await sendMessage(newMessage, activeConversation.id, otherParticipantId);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const getConversationName = (conversation) => {
    if (!conversation || !currentUser) return 'Loading...';
    
    const otherParticipantId = conversation.participants.find(id => id !== currentUser.uid);
    
    if (!otherParticipantId) return 'Unknown';
    
    // Return the participant's name if details are available, otherwise their ID
    return participantDetails[otherParticipantId]?.name || otherParticipantId.substring(0, 8);
  };

  const getLastMessagePreview = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    return conversation.lastMessage.length > 30 
      ? `${conversation.lastMessage.substring(0, 30)}...`
      : conversation.lastMessage;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>
      
      <Paper elevation={3} sx={{ height: '70vh', overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Conversation List */}
          <Grid item xs={12} md={4} sx={{ borderRight: '1px solid #e0e0e0', height: '100%' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search conversations..."
                InputProps={{
                  startAdornment: <SearchOutlined sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
              />
            </Box>
            
            <List sx={{ height: 'calc(100% - 64px)', overflowY: 'auto' }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                  <CircularProgress />
                </Box>
              ) : conversations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">No conversations yet</Typography>
                </Box>
              ) : (
                conversations.map(conversation => (
                  <React.Fragment key={conversation.id}>
                    <ListItem
                      button
                      selected={activeConversation?.id === conversation.id}
                      onClick={() => setActiveConversation(conversation)}
                      sx={{ 
                        '&.Mui-selected': { 
                          bgcolor: 'primary.light',
                          '&:hover': { bgcolor: 'primary.light' }
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={conversation.lastMessageRead || activeConversation?.id === conversation.id}
                        >
                          <Avatar>
                            {getConversationName(conversation).charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={getConversationName(conversation)}
                        secondary={getLastMessagePreview(conversation)}
                        primaryTypographyProps={{
                          fontWeight: !conversation.lastMessageRead && activeConversation?.id !== conversation.id ? 700 : 400
                        }}
                        secondaryTypographyProps={{
                          fontWeight: !conversation.lastMessageRead && activeConversation?.id !== conversation.id ? 600 : 400
                        }}
                      />
                      {conversation.lastMessageTime && (
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(conversation.lastMessageTime)}
                        </Typography>
                      )}
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              )}
            </List>
          </Grid>
          
          {/* Message Content */}
          <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <Box sx={{ p: 2, bgcolor: 'background.paper', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>
                      {getConversationName(activeConversation).charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6">{getConversationName(activeConversation)}</Typography>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
                
                {/* Messages */}
                <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
                  {messages.length === 0 ? (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <PersonIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No messages yet. Start the conversation!
                      </Typography>
                    </Box>
                  ) : (
                    messages.map(message => (
                      <Box
                        key={message.id}
                        sx={{
                          display: 'flex',
                          justifyContent: message.senderId === currentUser?.uid ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Paper
                          elevation={1}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            maxWidth: '75%',
                            bgcolor: message.senderId === currentUser?.uid ? 'primary.light' : 'white',
                            borderBottomRightRadius: message.senderId === currentUser?.uid ? 0 : 2,
                            borderBottomLeftRadius: message.senderId === currentUser?.uid ? 2 : 0,
                          }}
                        >
                          <Typography variant="body1">{message.text}</Typography>
                          <Typography variant="caption" color="text.secondary" align="right" display="block">
                            {formatTime(message.timestamp)}
                          </Typography>
                        </Paper>
                      </Box>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </Box>
                
                {/* Message Input */}
                <Box
                  component="form"
                  sx={{ p: 2, bgcolor: 'background.paper', borderTop: '1px solid #e0e0e0' }}
                  onSubmit={handleSendMessage}
                >
                  <Grid container spacing={2}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Type your message..."
                        variant="outlined"
                        size="medium"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={<SendIcon />}
                        disabled={!newMessage.trim()}
                      >
                        Send
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" align="center">
                  Select a conversation to start messaging
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400, mt: 1 }}>
                  You can message farmers or organizations directly from their product listings
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default MessagesPage;
