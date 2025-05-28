import  { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Clock, Home } from 'lucide-react';

export function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navigateToProject = () => {
    navigate('/project1');
  };

  return (
    <div className="min-h-screen">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div 
              className="flex"
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              <div 
                onClick={navigateToProject}
                className="group flex items-center px-2 py-2 cursor-pointer" 
              >
                <div className="relative mr-3">
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-all duration-700 ${isLogoHovered ? 'rotate-180 scale-110' : ''}`}
                  >
                    <path 
                      d="M3 18L12 9L21 18" 
                      stroke={isLogoHovered ? "#6366f1" : "#8b5cf6"} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className={`transition-all duration-500 ${isLogoHovered ? 'animate-pulse-stroke' : ''}`}
                    />
                    <path 
                      d="M3 14L12 5L21 14" 
                      stroke={isLogoHovered ? "#8b5cf6" : "#6d28d9"} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className={`transition-all duration-700 delay-75 ${isLogoHovered ? 'animate-pulse-stroke-delay' : ''}`}
                    />
                  </svg>
                  <div className={`absolute inset-0 bg-indigo-400/30 rounded-full scale-0 ${isLogoHovered ? 'animate-ping-slow' : ''}`}></div>
                </div>
                <span className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r ${
                  isLogoHovered ? 'from-indigo-500 to-purple-500' : 'from-indigo-400 to-purple-400'
                } transition-all duration-300`}>
                  Sketch Mentor
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-300"
              >
                <div className="relative">
                  <Home className={`h-5 w-5 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-500`} />
                  <div className="absolute inset-0 bg-indigo-300/20 rounded-full scale-0 group-hover:animate-ping-once"></div>
                </div>
                <span className="transition-all duration-300 group-hover:translate-x-1">Home</span>
              </Link>
              
              <Link
                to="/recent"
                className="group flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-300"
              >
                <div className="relative">
                  <Clock className={`h-5 w-5 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:text-indigo-500`} />
                  <div className="absolute inset-0 bg-indigo-300/20 rounded-full scale-0 group-hover:animate-ping-once"></div>
                </div>
                <span className="transition-all duration-300 group-hover:translate-x-1">Recent</span>
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-indigo-500 focus:outline-none"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
                  <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`h-0.5 w-full bg-current transition-all duration-300 ${isMobileMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-500 hover:bg-indigo-50"
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link
                to="/recent"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-500 hover:bg-indigo-50"
              >
                <Clock className="h-5 w-5 mr-2" />
                Recent
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Add necessary CSS */}
      <style>{`
        @keyframes pulse-stroke {
          0%, 100% { stroke-dasharray: 0; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 25; stroke-dashoffset: 10; }
        }
        .animate-pulse-stroke {
          animation: pulse-stroke 2s ease-in-out infinite;
        }
        .animate-pulse-stroke-delay {
          animation: pulse-stroke 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        @keyframes ping-slow {
          0% { transform: scale(0); opacity: 1; }
          70% { transform: scale(2); opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes ping-once {
          0% { transform: scale(0); opacity: 1; }
          70% { transform: scale(2); opacity: 0; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
      
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}