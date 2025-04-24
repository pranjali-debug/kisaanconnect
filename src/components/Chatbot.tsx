import React, { useState, useRef, useEffect } from 'react';
import { Send, Sprout, ArrowLeft, Bot, Loader2, RefreshCw, LogIn } from 'lucide-react';
import { geminiService, ChatMessage } from '../services/GeminiService';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './Auth/AuthModal';

const Chatbot: React.FC = () => {
  const { currentUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Namaste! I'm your KisaanConnect farming assistant, powered by Gemini AI. How can I help with your agricultural questions today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [partialResponse, setPartialResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [userInitiatedScroll, setUserInitiatedScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageRef = useRef<string>('');
  
  // Suggested queries for users to try
  const suggestedQueries = [
    "What crops are best for sandy soil?",
    "How to control aphids organically?",
    "Best practices for water conservation in farming",
    "When to plant kharif crops?",
    "Which vegetables grow well in containers?",
    "Natural remedies for plant diseases"
  ];

  // Prevent initial page scroll to bottom
  useEffect(() => {
    // Scroll window to top on component mount
    window.scrollTo(0, 0);
  }, []);

  // Improved smart scroll function
  const scrollToBottom = () => {
    if (shouldAutoScroll && !userInitiatedScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // More selective auto-scroll - only when user explicitly sends a message
  useEffect(() => {
    // Only auto-scroll when a new user message is added
    if (messages.length > 0 && messages[messages.length - 1].role === 'user' && !userInitiatedScroll) {
      scrollToBottom();
    }
  }, [messages]);
  
  // Only scroll when the AI completes its response, not during typing
  useEffect(() => {
    if (!isTyping && !isThinking && messages.length > 1 && 
        messages[messages.length - 1].role === 'assistant' && !userInitiatedScroll) {
      scrollToBottom();
    }
  }, [isTyping, isThinking, messages]);

  // Detect manual scrolling to disable auto-scroll
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        // If user scrolled up more than 100px from bottom
        if (scrollHeight - scrollTop - clientHeight > 100) {
          setUserInitiatedScroll(true);
          setShouldAutoScroll(false);
        } else if (scrollHeight - scrollTop - clientHeight < 20) {
          // If user scrolled back to bottom
          setShouldAutoScroll(true);
          // But keep track that user initiated scroll
          setUserInitiatedScroll(false);
        }
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Prevent auto-scrolling when user is typing
  useEffect(() => {
    const handleFocus = () => {
      // Don't auto-scroll when input field is focused
      // But don't change userInitiatedScroll to preserve user's scroll position
      setShouldAutoScroll(false);
    };
    
    const inputField = document.querySelector('input[type="text"]');
    if (inputField) {
      inputField.addEventListener('focus', handleFocus);
      return () => inputField.removeEventListener('focus', handleFocus);
    }
  }, []);

  const handleSendMessage = async (userMessage: string = input) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!userMessage.trim()) return;
    setError(null);
    
    // Store the message for potential retry
    lastUserMessageRef.current = userMessage;
    
    // Add user message to chat
    const userMsg: ChatMessage = { role: 'user', content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Don't force auto-scrolling - maintain user's scroll position
    // Only enable auto-scroll if user is already at the bottom
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight < 20) {
        setShouldAutoScroll(true);
      }
    }
    
    // Show loading indicators
    setIsLoading(true);
    setIsThinking(true);
    
    // Simulate "thinking" for a more natural feel
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(true);
      setPartialResponse('');
      
      // Start typing effect
      let fullResponse = '';
      let typingTimeout: NodeJS.Timeout;
      
      const typeResponse = async () => {
        try {
          // Get the actual response from Gemini
          const response = await geminiService.generateResponse([...messages, userMsg]);
          
          // Check if response indicates an error
          if (response.includes("Sorry, I encountered an error") || 
              response.includes("API key") || 
              response.includes("rate limit")) {
            setError(response);
            setIsTyping(false);
            setIsLoading(false);
            return;
          }
          
          fullResponse = response;
          
          // Simulate typing effect
          let displayedLength = 0;
          const typeCharacter = () => {
            if (displayedLength < fullResponse.length) {
              const nextChunkSize = Math.floor(Math.random() * 5) + 1; // Random chunk between 1-5 chars
              displayedLength = Math.min(displayedLength + nextChunkSize, fullResponse.length);
              setPartialResponse(fullResponse.substring(0, displayedLength));
              typingTimeout = setTimeout(typeCharacter, Math.random() * 50 + 10); // Random delay
            } else {
              // Finished typing
              setIsTyping(false);
              setIsLoading(false);
              setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
              setPartialResponse('');
              
              // Only scroll automatically at the end of the response if user is already at bottom
              if (chatContainerRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
                if (scrollHeight - scrollTop - clientHeight < 50) {
                  setShouldAutoScroll(true);
                  setTimeout(scrollToBottom, 100);
                }
              }
            }
          };
          
          typeCharacter();
        } catch (error) {
          console.error('Error getting response:', error);
          setIsTyping(false);
          setIsLoading(false);
          setError('Something went wrong. Please try again.');
        }
      };
      
      typeResponse();
      
      return () => {
        clearTimeout(typingTimeout);
      };
    }, 2000); // Increased thinking time for better visibility
  };

  const handleRetry = () => {
    if (lastUserMessageRef.current) {
      // Remove the last user message if it resulted in an error
      setMessages(prev => prev.slice(0, -1));
      handleSendMessage(lastUserMessageRef.current);
    }
  };

  const handleSuggestedQuery = (query: string) => {
    // Temporarily disable auto-scroll when selecting a suggested query
    const wasUserInitiatedScroll = userInitiatedScroll;
    const wasShouldAutoScroll = shouldAutoScroll;
    
    // Pass the query to the message handler
    handleSendMessage(query);
    
    // Delay restoring the scroll state slightly to prevent immediate scroll
    setTimeout(() => {
      setUserInitiatedScroll(wasUserInitiatedScroll);
      setShouldAutoScroll(wasShouldAutoScroll);
    }, 50);
  };

  // Add a scroll to bottom button
  const scrollDownButton = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight - scrollTop - clientHeight > 100) {
        return (
          <button
            onClick={() => {
              setShouldAutoScroll(true);
              setTimeout(scrollToBottom, 100);
            }}
            className="absolute bottom-24 right-6 bg-kisaan-green text-white p-2 rounded-full shadow-md z-10"
            aria-label="Scroll to bottom"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        );
      }
    }
    return null;
  };

  return (
    <section className="py-14 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <a 
            href="#/" 
            className="flex items-center gap-2 text-kisaan-darkbrown hover:text-kisaan-green transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </a>
          
          <h1 className="text-2xl font-bold text-kisaan-darkbrown ml-auto flex items-center">
            <Bot className="h-6 w-6 text-kisaan-green mr-2" />
            KisaanConnect Assistant
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-180px)] relative">
          {/* Chat header */}
          <div className="p-4 bg-kisaan-cream/30 border-b flex items-center">
            <div className="bg-kisaan-green rounded-full p-2 mr-3">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-kisaan-darkbrown">KisaanGPT</h2>
              <p className="text-sm text-kisaan-brown">Agricultural Assistant powered by Gemini AI</p>
            </div>
          </div>
          
          {/* Chat messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-kisaan-green/10 text-kisaan-darkbrown' 
                      : 'bg-white border border-gray-200 shadow-sm'
                  }`}
                >
                  {message.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.split(/(\*\*.*?\*\*)/).map((segment, j) => {
                        // If segment is wrapped in ** (bold markdown)
                        if (segment.startsWith('**') && segment.endsWith('**')) {
                          return <strong key={j}>{segment.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{segment}</span>;
                      })}
                      {i < message.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex items-center">
                  <div className="flex items-center gap-1 mr-2">
                    <span className="inline-block w-2 h-2 bg-kisaan-green rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }}></span>
                    <span className="inline-block w-2 h-2 bg-kisaan-green rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.8s' }}></span>
                    <span className="inline-block w-2 h-2 bg-kisaan-green rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '0.8s' }}></span>
                  </div>
                  <span className="text-sm text-kisaan-brown">Thinking...</span>
                </div>
              </div>
            )}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm max-w-[75%]">
                  {partialResponse.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.split(/(\*\*.*?\*\*)/).map((segment, j) => {
                        // If segment is wrapped in ** (bold markdown)
                        if (segment.startsWith('**') && segment.endsWith('**')) {
                          return <strong key={j}>{segment.slice(2, -2)}</strong>;
                        }
                        return <span key={j}>{segment}</span>;
                      })}
                      {i < partialResponse.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <span className="inline-block w-1 h-4 bg-kisaan-green animate-blink ml-0.5"></span>
                </div>
              </div>
            )}
            
            {/* Error message with retry button */}
            {error && (
              <div className="flex justify-start w-full">
                <div className="bg-red-50 border border-red-100 rounded-lg p-4 shadow-sm flex items-center justify-between max-w-[75%] w-full">
                  <span className="text-red-700">{error}</span>
                  <button 
                    onClick={handleRetry}
                    className="ml-4 flex items-center gap-1 bg-kisaan-cream text-kisaan-darkbrown px-3 py-1 rounded-md hover:bg-kisaan-cream/80 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span>Retry</span>
                  </button>
                </div>
              </div>
            )}
            
            {/* This div is used as a marker for scrolling to bottom */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Scroll to bottom button */}
          {scrollDownButton()}
          
          {/* Suggested queries */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 border-t border-gray-100">
              <p className="text-sm text-kisaan-brown mb-2">Try asking about:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((query, index) => (
                  <button
                    key={index}
                    className="text-xs bg-kisaan-cream/50 hover:bg-kisaan-cream text-kisaan-darkbrown px-3 py-1.5 rounded-full transition-colors"
                    onClick={() => handleSuggestedQuery(query)}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Chat input */}
          <div className="p-4 border-t border-gray-100">
            {!currentUser && (
              <div className="flex items-center gap-2 mb-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3 shadow-sm">
                <LogIn className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-700">Please log in to send messages.</span>
              </div>
            )}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Don't auto-scroll when user is typing
                  setShouldAutoScroll(false);
                }}
                onFocus={() => setShouldAutoScroll(false)}
                placeholder="Ask any agricultural question..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-kisaan-green/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-kisaan-green text-white rounded-full p-2 hover:bg-kisaan-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </form>
            <p className="text-xs text-center text-gray-400 mt-2">
              Powered by Gemini 1.5 Pro • For agricultural information only
            </p>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </section>
  );
};

export default Chatbot;