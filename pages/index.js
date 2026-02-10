import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Error: ${data.error || 'Something went wrong'}` 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Failed to connect to the server.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      <Head>
        <title>CV Chatbot - Ask Me Anything</title>
        <meta name="description" content="Interactive CV chatbot powered by RAG" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.container}>
        <div style={styles.chat}>
          <div style={styles.header}>
            <h1 style={styles.title}>💬 CV Chatbot</h1>
            <p style={styles.subtitle}>Ask me anything about my experience, skills, or background</p>
            {messages.length > 0 && (
              <button onClick={clearChat} style={styles.clearBtn}>
                Clear Chat
              </button>
            )}
          </div>

          <div style={styles.messagesContainer}>
            {messages.length === 0 ? (
              <div style={styles.empty}>
                <h2 style={styles.emptyTitle}>👋 Hi! I'm here to help</h2>
                <p style={styles.emptyText}>Try asking:</p>
                <div style={styles.suggestions}>
                  <button 
                    onClick={() => setInput("What is your work experience?")}
                    style={styles.suggestionBtn}
                  >
                    What is your work experience?
                  </button>
                  <button 
                    onClick={() => setInput("Tell me about your skills")}
                    style={styles.suggestionBtn}
                  >
                    Tell me about your skills
                  </button>
                  <button 
                    onClick={() => setInput("What is your educational background?")}
                    style={styles.suggestionBtn}
                  >
                    What is your educational background?
                  </button>
                  <button 
                    onClick={() => setInput("What projects have you worked on?")}
                    style={styles.suggestionBtn}
                  >
                    What projects have you worked on?
                  </button>
                </div>
              </div>
            ) : (
              <div style={styles.messages}>
                {messages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.message,
                      ...(msg.role === 'user' ? styles.userMessage : styles.assistantMessage)
                    }}
                  >
                    <div style={styles.messageRole}>
                      {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
                    </div>
                    <div style={styles.messageContent}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{...styles.message, ...styles.assistantMessage}}>
                    <div style={styles.messageRole}>🤖 Assistant</div>
                    <div style={styles.messageContent}>
                      <div style={styles.typing}>Thinking...</div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} style={styles.inputForm}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={styles.input}
              disabled={loading}
            />
            <button 
              type="submit" 
              style={{
                ...styles.sendBtn,
                ...(loading || !input.trim() ? styles.sendBtnDisabled : {})
              }}
              disabled={loading || !input.trim()}
            >
              {loading ? '⏳' : '📤'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  chat: {
    maxWidth: '900px',
    margin: '0 auto',
    height: '95vh',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '25px 30px',
    borderRadius: '20px 20px 0 0',
    position: 'relative',
  },
  title: {
    margin: '0 0 5px 0',
    fontSize: '28px',
    fontWeight: '700',
  },
  subtitle: {
    margin: '0',
    fontSize: '14px',
    opacity: '0.9',
  },
  clearBtn: {
    position: 'absolute',
    top: '25px',
    right: '30px',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  messagesContainer: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    background: '#f8f9fa',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyTitle: {
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  emptyText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  suggestionBtn: {
    background: 'white',
    border: '2px solid #667eea',
    color: '#667eea',
    padding: '14px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  message: {
    padding: '16px',
    borderRadius: '12px',
    maxWidth: '80%',
    animation: 'fadeIn 0.3s',
  },
  userMessage: {
    background: '#667eea',
    color: 'white',
    marginLeft: 'auto',
    borderBottomRightRadius: '4px',
  },
  assistantMessage: {
    background: 'white',
    color: '#333',
    border: '1px solid #e0e0e0',
    marginRight: 'auto',
    borderBottomLeftRadius: '4px',
  },
  messageRole: {
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '6px',
    opacity: '0.8',
  },
  messageContent: {
    fontSize: '15px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  typing: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontStyle: 'italic',
    opacity: '0.7',
  },
  inputForm: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    background: 'white',
    borderTop: '1px solid #e0e0e0',
  },
  input: {
    flex: 1,
    padding: '14px 18px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  sendBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '20px',
    transition: 'all 0.2s',
    minWidth: '60px',
  },
  sendBtnDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
};
