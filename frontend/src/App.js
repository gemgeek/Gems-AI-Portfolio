import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, Code, Send, Bot, Phone, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

// --- PERSONAL DATA & CONFIG ---
const portfolioData = {
  name: "GEM",
  avatar: "/images/gem-geek-avatar.jpg",
  presentationPhoto: "/images/Pretty-Gbeve.jpg", 
  bio: "My AI Portfolio",
  suggestedQuestions: [
    { text: "About Me", icon: <User size={16} />, key: "about", prompt: "Tell me all about GEM" },
    { text: "Projects", icon: <Briefcase size={16} />, key: "projects", prompt: "Show me her projects." },
    { text: "Skills", icon: <Code size={16} />, key: "skills", prompt: "What are her skills?" },
    { text: "Fun Facts", icon: <Sparkles size={16} />, key: "fun", prompt: "What are some fun facts about her?" },
    { text: "Contact", icon: <Phone size={16} />, key: "contact", prompt: "How can I contact her?" },
  ]
};

// --- COMPONENTS ---

const ProjectCard = ({ project }) => (
  <a 
    href={project.link} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-white/80 backdrop-blur-md rounded-2xl p-4 w-full sm:w-60 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg border border-gray-200 flex flex-col"
  >
    <div className="w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-200">
      <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover" />
    </div>
    <div className="flex-grow">
      <p className="text-xs text-gray-500 uppercase">{project.title}</p>
      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
    </div>
  </a>
);

const ChatMessage = ({ message }) => {
  const { sender, type, data, isLoading } = message;
  const isUser = sender === 'user';

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
        </div>
      );
    }

    if (type === 'cards' && Array.isArray(data)) {
      return (
        <div className="mt-2 w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-start">
            {data.map((project, index) => <ProjectCard key={index} project={project} />)}
          </div>
        </div>
      );
    }
    
    const shouldShowPhoto = typeof data === 'string' && data.includes('[SHOW_PHOTO]');
    const cleanData = typeof data === 'string' ? data.replace('[SHOW_PHOTO]', '') : data;

    return (
      <div>
        <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: cleanData }} />
        {shouldShowPhoto && (
           <img src={portfolioData.presentationPhoto} alt="Presentation" className="mt-4 rounded-lg shadow-md max-w-xs" />
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col mb-6 animate-fade-in-up ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${isUser ? 'bg-indigo-500' : 'bg-pink-500'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        {isUser ? (
          <div className="p-4 rounded-2xl max-w-md bg-indigo-500 text-white rounded-br-none">
            {data}
          </div>
        ) : (
          <div className={`p-4 rounded-2xl max-w-full ${type !== 'cards' ? 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm' : ''} rounded-bl-none`}>
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text, isRetry = false) => {
    if (!text.trim()) return;

    // Only add user message and loading indicator on the first try
    if (!isRetry) {
      const userMessage = { sender: 'user', type: 'text', data: text };
      setMessages(prev => [...prev, userMessage]);
      setInputValue('');
      setShowQuickQuestions(false);
      setMessages(prev => [...prev, { sender: 'ai', type: 'text', data: '', isLoading: true }]);
    }

    try {
      const response = await fetch('https://gems-ai-portfolio-backend.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const aiResponse = await response.json();
      const aiMessage = { sender: 'ai', type: aiResponse.type, data: aiResponse.data, isLoading: false };
      
      setMessages(prev => prev.map(m => m.isLoading ? aiMessage : m));

    } catch (error) {
      console.error("Fetch attempt failed:", error);

      // --- THIS IS THE NEW LOGIC ---
      if (!isRetry) {
        // First attempt failed, show "waking up" message and retry
        const wakingUpMessage = { sender: 'ai', type: 'text', data: "My AI brain is waking up... please give it a moment! 🧠✨", isLoading: false };
        setMessages(prev => prev.map(m => m.isLoading ? wakingUpMessage : m));
        
        // Wait 15 seconds for the server to wake up, then retry
        setTimeout(() => {
          handleSendMessage(text, true); // The second argument `true` marks this as a retry
        }, 15000);

      } else {
        // Retry also failed, show a final friendly error message
        const finalErrorMessage = { sender: 'ai', type: 'text', data: "Looks like my AI is taking a coffee break! ☕️ Please try refreshing the page in a moment.", isLoading: false };
        setMessages(prev => prev.map(m => m.isLoading ? finalErrorMessage : m));
      }
    }
  };

  const handleQuickQuestion = (prompt) => {
     handleSendMessage(prompt);
  };
  
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-gradient-to-r from-fuchsia-200 to-pink-200 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-[30%] right-[15%] w-[30%] h-[30%] bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-3xl mx-auto flex flex-col h-full z-10" style={{ height: 'calc(100vh - 2rem)' }}>
        <header className="text-center py-8">
          {messages.length === 0 && (
            <div className="animate-fade-in-down">
              <img src={portfolioData.avatar} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg" />
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">Hey, I'm {portfolioData.name} 👋</h1>
              <p className="text-lg sm:text-xl text-gray-600">{portfolioData.bio}</p>
            </div>
          )}
        </header>

        <main className="flex-grow overflow-y-auto custom-scrollbar pr-2 mb-4">
          <div className="space-y-6">
            {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
          </div>
          <div ref={chatEndRef} />
        </main>
            
        <footer className="pt-2 pb-2">
          {messages.length > 0 && (
            <div className="text-center mb-4">
              <button onClick={() => setShowQuickQuestions(!showQuickQuestions)} className="text-gray-500 hover:text-gray-800 transition-colors duration-200 flex items-center gap-2 mx-auto text-sm">
                {showQuickQuestions ? 'Hide suggested questions' : 'Show suggested questions'}
                {showQuickQuestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
          )}
                
          {showQuickQuestions && (
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 animate-fade-in-up">
              {portfolioData.suggestedQuestions.map((q) => (
                <button key={q.key} onClick={() => handleQuickQuestion(q.prompt)} className="flex items-center gap-2 bg-white/60 backdrop-blur-md border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-white/80 hover:border-gray-300 transition-all duration-200 shadow-sm">
                  {q.icon}
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          )}
                
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
              placeholder="Ask me anything..."
              className="w-full bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl py-3 pl-4 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 shadow-sm"
            />
            <button 
              onClick={() => handleSendMessage(inputValue)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-500 rounded-lg w-9 h-9 flex items-center justify-center hover:bg-indigo-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim()}
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </footer>
      </div>
        <style jsx global>{`
            .prose a { color: #6d28d9; text-decoration: underline; }
            .prose a:hover { color: #5b21b6; }
            .prose { max-width: none; }
            .prose p { margin-top: 0; margin-bottom: 0.5em; }
            .prose h1, .prose h2, .prose h3 { margin-top: 0; margin-bottom: 0.5em; }
            .prose strong { color: #1f2937; }
            .prose ul { margin-top: 0.5em; margin-bottom: 0.5em; padding-left: 1.5em; }
            .prose li { margin-top: 0.25em; margin-bottom: 0.25em; }
            .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down { animation: fadeInDown 0.5s ease-out forwards; }
            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-blob { animation: blob 10s infinite; }
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(30px, -50px) scale(1.1); }
                66% { transform: translate(-20px, 20px) scale(0.9); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animation-delay-2000 { animation-delay: -2s; }
            .animation-delay-4000 { animation-delay: -4s; }
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.2); }
        `}</style>
    </div>
  );
}
