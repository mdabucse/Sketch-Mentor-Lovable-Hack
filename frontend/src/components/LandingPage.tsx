import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './LandingPage.css';




const LandingPage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
 

  // Navigation dots
  const sections = ['home', 'canvas', 'transcribe', 'chatbot','studyhelper'];
  
  // Key features data
  const keyFeatures = [
    {
      id: 'sketch-mentor',
      title: "Sketch Mentor",
      tagline: "Bring your learning to life",
      description: "Sketch Mentor is your AI-powered learning assistant that helps visualize and solve problems through interactive sketches and real-time understanding. Perfect for students and educators aiming for deep conceptual clarity.",
      icon: "🧑‍🏫",
      color: "#FFF6EC", // Updated background color
      accentColor: "#5F5DFF",
      actionText: "Get Started",
      imageUrl: "/public/intro.jpg",
      borderStyle: {
        border: "2px solid #5F5DFF",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)"
      }
    },
        
        
    
    {
      id: 'canvas',
      title: "AI Canvas",
      tagline: "Let AI solve your equations",
      description: "Draw or write equations directly on the canvas and watch as our AI instantly recognizes and solves them. Perfect for learning complex mathematical concepts.",
      icon: "✏️",
      color: "#E8F3FF",
      accentColor: "#007FFF",
      action: "/sketch-mentor", // Updated from /canvas to /sketch-mentor
      actionText: "Try Canvas",
      imageUrl: "/public/Canvas.jpg"
    },
    {
      id: 'transcribe',
      title: "Video Transcriber",
      tagline: "Convert video to searchable text",
      description: "Upload educational videos and get accurate transcriptions with OpenAI Whisper. Search through content, highlight key points, and extract knowledge with ease.",
      icon: "🎬",
      color: "#F0FFF4",
      accentColor: "#00C853",
      action: "/math-visualization", // Updated from /transcribe to /math-visualization
      actionText: "Transcribe Video",
      imageUrl: "/VideoGeneration.jpg"
    },
    {
      id: 'mathhelperbot',
      title: "Math & Sketch Tools",
      tagline: "Canvas & Video Generator",
      description: "Access visualisation tools, sketch monitor and math problem solvers",
      icon: "➗",
      color: "#FFF5E8",
      accentColor: "#FF9500",
      action: "/project1", // Updated from /chatbot to /project1
      actionText: "Chat Now",
      imageUrl: "/AiChatbot.jpg"
    },
    {
      id: 'studyhelper',
      title: "Study Helper",
      tagline: "All in one study helper bot",
      description: "Access your Study materials, summaries, quizzes, flash cards and recent activities.",
      icon: "📚",
      color: "#F3E8FF",  // Light purple/lavender background
      accentColor: "#7C3AED",  // Vibrant purple accent color
      action: "/project1",
      actionText: "Chat Now",
      imageUrl: "/AiChatbot.jpg"
    }
  ];

  // Handle scroll to sections
  const scrollToSection = (index) => {
    const section = document.getElementById(sections[index]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveSection(index);
  };

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - left) / width));
      const y = Math.max(0, Math.min(1, (e.clientY - top) / height));
      setCursorPosition({ x, y });
    }
  };

  // Initialize and setup animation effects
  useEffect(() => {
    setIsLoaded(true);

    // Update active section on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const sectionElements = sections.map(id => document.getElementById(id));
      
      sectionElements.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (
            scrollPosition >= sectionTop - windowHeight / 2 &&
            scrollPosition < sectionTop + sectionHeight - windowHeight / 2
          ) {
            setActiveSection(index);
          }
        }
      });
    };

    // Set up intersection observer for fade-in animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe all animate elements
    document.querySelectorAll('.animate-element').forEach((el) => {
      observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [sections.length]);

  return (
    <div 
      className={`landing-container ${isLoaded ? 'loaded' : ''}`}
      ref={containerRef}
      style={{
        '--cursor-x': cursorPosition.x,
        '--cursor-y': cursorPosition.y
      }}
    >

      {/* Features Sections */}
      {keyFeatures.map((feature, index) => (
        <section 
          id={feature.id}
          key={feature.id}
          className="feature-section"
          style={{ 
            '--feature-color': feature.color,
            '--accent-color': feature.accentColor
          }}
        >
          <div className="feature-content-wrapper">
            <div className="feature-content animate-element">
              <span className="feature-index">{`0${index + 1}`}</span>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-tagline">{feature.tagline}</p>
              <p className="feature-description">{feature.description}</p>
              
              <Link to={feature.action} className="feature-button">
                <span>{feature.actionText}</span>
                <span className="arrow-icon">→</span>
              </Link>
            </div>
            
            <div className="feature-visual animate-element">
              <div className="feature-image-container">
                <div className="feature-icon-large">{feature.icon}</div>
                <img 
                  src={feature.imageUrl} 
                  alt={feature.title} 
                  className="feature-image" 
                />
                <div className="feature-decoration-circle"></div>
                <div className="feature-decoration-dots"></div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Call to Action */}
      <section className="cta-section animate-element">
        <div className="cta-content">
          <h2>Ready to enhance your learning?</h2>
          <p>Start using SketchMentor's AI-powered tools today</p>
          
          <div className="cta-buttons">
  <Link to="/project1" className="cta-button primary">
    <span>Upload</span>
    <span className="arrow-icon">→</span>
  </Link>
  <Link to="/project2" className="cta-button secondary">
    <span className="text-white">Visual Learning</span>
    <span className="arrow-icon text-white">→</span>
  </Link>
</div>

        </div>
      </section>

      

{/* Footer */}
<footer className="site-footer bg-slate-900 text-white py-4">
  <div className="container mx-auto px-4">
    {/* Main footer content - more compact grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {/* Brand section */}
      <div className="footer-brand col-span-2 md:col-span-1">
        <h3 className="text-lg font-bold mb-1 text-blue-400">SketchMentor</h3>
        <p className="text-gray-400 text-xs mb-2">AI-powered learning assistant</p>
        <div className="social-icons flex space-x-2">
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Features section */}
      <div className="footer-links text-xs">
        <h4 className="text-xs font-semibold mb-1 text-blue-300">AI Tools</h4>
        <ul className="space-y-1">
          <li><a href="/sketch-mentor" className="text-gray-400 hover:text-blue-400 transition-colors">AI Canvas</a></li>
          <li><a href="/math-visualization" className="text-gray-400 hover:text-blue-400 transition-colors">Video Transcriber</a></li>
          <li><a href="/project1" className="text-gray-400 hover:text-blue-400 transition-colors">RAG Chatbot</a></li>
        </ul>
      </div>

      {/* Resources section */}
      <div className="footer-resources text-xs">
        <h4 className="text-xs font-semibold mb-1 text-blue-300">Resources</h4>
        <ul className="space-y-1">
          <li><a href="/help" className="text-gray-400 hover:text-blue-400 transition-colors">Help Center</a></li>
          <li><a href="/tutorials" className="text-gray-400 hover:text-blue-400 transition-colors">Tutorials</a></li>
          <li><a href="/blog" className="text-gray-400 hover:text-blue-400 transition-colors">Blog</a></li>
        </ul>
      </div>
      
      {/* Newsletter - fixed to be fully visible */}
      <div className="footer-newsletter text-xs">
        <h4 className="text-xs font-semibold mb-1 text-blue-300">Stay Updated</h4>
        <div className="flex">
          <input 
            type="email" 
            placeholder="Email" 
            className="bg-slate-800 text-white text-xs px-2 py-1 rounded-l w-24 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
          <button 
  type="submit" 
  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium w-32 py-1 rounded-r transition-colors"
>
  Subscribe
</button>


        </div>
      </div>
    </div>
    
    {/* Footer bottom */}
    <div className="border-t border-slate-800 pt-2 flex flex-col md:flex-row items-center text-xs">
      <p className="text-gray-500 mb-1 md:mb-0">&copy; 2025 SketchMentor. All rights reserved.</p>
      <div className="flex space-x-3 md:ml-auto">
        <a href="/privacy" className="text-gray-500 hover:text-blue-400 transition-colors">Privacy</a>
        <a href="/terms" className="text-gray-500 hover:text-blue-400 transition-colors">Terms</a>
        <a href="/contact" className="text-gray-500 hover:text-blue-400 transition-colors">Contact</a>
      </div>
    </div>
  </div>
</footer>
</div>
  );
};

export default LandingPage;