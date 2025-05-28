import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const navigateHome = () => {
    navigate('/');
  };

  const navigateToAICanvas = () => {
    navigate('/sketch-mentor');
  };

  const navigateToVideoGenerator = () => {
    navigate('/math-visualization');
  };

  return (
    <header className={`header fixed-header ${scrolled ? 'scrolled' : ''}`}>
      <div 
        className={`logo-container ${hoverLogo ? 'pulse' : ''}`}
        onMouseEnter={() => setHoverLogo(true)}
        onMouseLeave={() => setHoverLogo(false)}
        onClick={navigateHome}
      >
        <div className="logo">
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="logo-svg"
          >
            <path d="M3 18L12 9L21 18" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-path-top" />
            <path d="M3 14L12 5L21 14" stroke="var(--secondary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-path-bottom" />
          </svg>
          <span id='logo_name' className="gradient-text">Sketch Mentor</span>
        </div>
      </div>

      <nav className="nav">
        <ul className="nav-items">
          <li className="nav-item">
            <button className="nav-link" onClick={navigateHome}>
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={navigateToAICanvas}>
              <span className="nav-icon">✏️</span>
              <span className="nav-text">AI Canvas</span>
            </button>
          </li>
          <li className="nav-item">
            <button className="nav-link" onClick={navigateToVideoGenerator}>
              <span className="nav-icon">🎬</span>
              <span className="nav-text">Video Generator</span>
            </button>
          </li>
        </ul>

        <button
          className={`mobile-menu-btn ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <ul>
            <li><button onClick={navigate("/project1")} className="mobile-menu-item">
              <span className="mobile-menu-icon">🏠</span>Home
            </button></li>
            <li><button onClick={navigate("/Visual")} className="mobile-menu-item">
              <span className="mobile-menu-icon">✏️</span>AI Canvas
            </button></li>
            <li><button onClick={navigate("/solve")} className="mobile-menu-item">
              <span className="mobile-menu-icon">🎬</span>Video Generator
            </button></li>
          </ul>
        </div>
      )}
    </header>
  );
}

export default Header;