import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, Code, Sparkles, Send, Bot, ChevronDown, ChevronUp, Phone } from 'lucide-react';

// --- MY PERSONALIZED PORTFOLIO DATA ---
const portfolioData = {
  name: "GEM",
  avatar: "/images/gem-geek-avatar.jpg",
  intro: "My AI Portfolio",
  quickQuestions: [
    { text: "About Me", icon: <User className="w-4 h-4" />, key: "about" },
    { text: "Projects", icon: <Briefcase className="w-4 h-4" />, key: "projects" },
    { text: "Skills", icon: <Code className="w-4 h-4" />, key: "skills" },
    { text: "Contact", icon: <Phone className="w-4 h-4" />, key: "contact" },
  ],
  responses: {
    about: {
      type: "text",
      content: "I'm a Full-Stack Software Developer specializing in creating robust backend APIs with Django and dynamic, responsive frontends with React/Next.js."
    },
    projects: {
      type: "cards",
      content: [
        {
          title: "Web App",
          name: "HandyHub",
          imageUrl: "/images/HandyHub-UI-Home.jpeg",
          link: "https://github.com/gemgeek/HandyHub-frontend"
        },
        {
          title: "Brand Identity Design",
          name: "LUMIERE",
          imageUrl: "/images/LUMIERE.jpg",
          link: "https://www.yogem.art/"
        },
        {
          title: "UI/UX Design",
          name: "FIT App (Farmers In Tech)",
          imageUrl: "/images/FIT-App.jpg",
          link: "https://github.com/gemgeek"
        }
      ]
    },
    skills: {
      type: "list",
      content: ["React", "TypeScript", "Next.js", "HTML5", "Tailwind CSS", "JavaScript(ES6+)", "Python", "Django", "DRF", "REST API Design", "Middleware", "PostgreSQL", "SQLite", "Flask", "Figma", "UI/UX Design", "Canva", "Photoshop", "Prompt Engineering"]
    },
    contact: {
        type: "text",
        content: "I'd love to connect! The best way to reach me is via email at my.email@example.com or on LinkedIn. I'm always open to new opportunities and collaborations."
    },
    default: {
        type: "text",
        content: "Hi, I'm GEM! I'm a creative developer with a background in design, driven by a curiosity for how technology can solve real-world problems. I specialize in full-stack development and I'm passionate about the future of AI. My goal is to leverage my skills to build the next generation of intelligent and intuitive web applications."
    }
  }
};

// --- COMPONENTS ---

const ProjectCard = ({ project }) => (
  <a href={project.link} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-4 sm:p-6 w-full sm:w-64 transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg border border-gray-200/80 group">
    <div className="h-32 mb-4 rounded-lg overflow-hidden">
      <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    </div>
    <p className="text-xs text-gray-500 uppercase">{project.title}</p>
    <h3 className="text-xl font-bold text-gray-900">{project.name}</h3>
  </a>
);

const SkillBubble = ({ skill }) => (
    <div className="bg-white rounded-full px-4 py-2 text-gray-700 font-medium shadow-md border border-gray-200/80">
        {skill}
    </div>
);

const ChatMessage = ({ message }) => {
  const { sender, type, content, cards, list } = message;
  const isUser = sender === 'user';

  return (
    <div className={`flex flex-col mb-6 animate-fade-in-up ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-md ${isUser ? 'bg-indigo-500' : 'bg-pink-500'}`}>
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>
        <div className={`p-4 rounded-2xl max-w-md shadow-md ${isUser ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200/80'}`}>
          {type === 'text' && <p>{content}</p>}
        </div>
      </div>
      {type === 'cards' && (
        <div className="mt-4 w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 ml-11">My Projects</h2>
          <div className="flex flex-wrap gap-4 justify-start ml-11">
            {cards.map((project, index) => <ProjectCard key={index} project={project} />)}
          </div>
        </div>
      )}
      {type === 'list' && (
        <div className="mt-4 w-full ml-11">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">My Skills</h2>
            <div className="flex flex-wrap gap-3">
                {list.map((skill, index) => <SkillBubble key={index} skill={skill} />)}
            </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    const userMessage = { sender: 'user', type: 'text', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickQuestions(false);
    
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      let key = 'default';
      if (lowerText.includes('project')) key = 'projects';
      else if (lowerText.includes('about') || lowerText.includes('me')) key = 'about';
      else if (lowerText.includes('skill')) key = 'skills';
      else if (lowerText.includes('contact') || lowerText.includes('reach')) key = 'contact';
      
      const responseData = portfolioData.responses[key] || portfolioData.responses.default;
      
      const aiMessage = {
        sender: 'ai',
        type: responseData.type,
        content: responseData.content,
        cards: responseData.type === 'cards' ? responseData.content : [],
        list: responseData.type === 'list' ? responseData.content : []
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleQuickQuestion = (key) => {
     const questionText = portfolioData.quickQuestions.find(q => q.key === key)?.text || key;
     handleSendMessage(questionText);
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans flex flex-col items-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute top-0 -left-4 w-72 h-72 md:w-96 md:h-96 bg-fuchsia-200 rounded-full filter blur-3xl animate-blob"></div>
            <div className="absolute -bottom-8 right-4 w-72 h-72 md:w-96 md:h-96 bg-cyan-200 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full z-10" style={{maxHeight: 'calc(100vh - 3rem)'}}>
            <header className="text-center pt-8 pb-8 shrink-0">
              {messages.length === 0 && (
                <div className="animate-fade-in-down">
                    <img src={portfolioData.avatar} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Hey, I'm {portfolioData.name} 👋</h1>
                    <p className="text-lg sm:text-xl text-gray-500">{portfolioData.intro}</p>
                </div>
              )}
            </header>

            <main className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
                <div className="space-y-6">
                    {messages.map((msg, index) => <ChatMessage key={index} message={msg} />)}
                </div>
                <div ref={chatEndRef} />
            </main>
            
            <footer className="pt-6 pb-2 shrink-0">
                {messages.length > 0 && (
                    <div className="text-center mb-4">
                        <button onClick={() => setShowQuickQuestions(!showQuickQuestions)} className="text-gray-500 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2 mx-auto text-sm">
                            {showQuickQuestions ? 'Hide quick questions' : 'Show quick questions'}
                            {showQuickQuestions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                    </div>
                )}
                
                {showQuickQuestions && (
                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 animate-fade-in-up">
                        {portfolioData.quickQuestions.map((q) => (
                            <button key={q.key} onClick={() => handleQuickQuestion(q.key)} className="flex items-center gap-2 bg-white border border-gray-200/80 rounded-lg px-3 py-2 text-sm hover:bg-gray-100/80 transition-colors duration-200 shadow-sm">
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
                        className="w-full bg-white border border-gray-300 rounded-xl py-3 pl-4 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-shadow duration-300 shadow-sm"
                    />
                    <button 
                        onClick={() => handleSendMessage(inputValue)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 rounded-lg w-9 h-9 flex items-center justify-center text-white hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!inputValue.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </footer>
        </div>
        <style jsx>{`
            .animate-fade-in-up {
                animation: fadeInUp 0.5s ease-out forwards;
            }
            @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down {
                animation: fadeInDown 0.5s ease-out forwards;
            }
            @keyframes fadeInDown {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.1);
                border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.2);
            }
            .animate-blob {
                animation: blob 15s infinite;
            }
            @keyframes blob {
                0% { transform: translate(0px, 0px) scale(1); }
                33% { transform: translate(40px, -60px) scale(1.2); }
                66% { transform: translate(-30px, 30px) scale(0.8); }
                100% { transform: translate(0px, 0px) scale(1); }
            }
            .animation-delay-4000 {
                animation-delay: -7s;
            }
        `}</style>
    </div>
  );
}