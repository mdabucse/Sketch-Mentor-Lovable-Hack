import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HeroSection.css';

function HeroSection() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [animatedElements, setAnimatedElements] = useState([
    { id: 1, icon: '∫', size: 40, x: 15, y: 20, speed: 0.8, rotation: 0 },
    { id: 2, icon: '∑', size: 50, x: 75, y: 30, speed: 1.2, rotation: 15 },
    { id: 3, icon: 'π', size: 35, x: 40, y: 60, speed: 1, rotation: -10 },
    { id: 4, icon: '√', size: 45, x: 85, y: 70, speed: 0.9, rotation: 5 },
    { id: 5, icon: '∞', size: 55, x: 25, y: 80, speed: 1.1, rotation: -5 },
    { id: 6, icon: '📄', size: 35, x: 65, y: 15, speed: 0.7, rotation: 10 },
    { id: 7, icon: '📝', size: 30, x: 90, y: 40, speed: 1.3, rotation: -15 },
    { id: 8, icon: '📊', size: 38, x: 10, y: 45, speed: 1, rotation: 8 }
  ]);

  const handleAICanvasClick = () => {
    navigate('/sketch-mentor');
  };

  const handleVideoGeneratorClick = () => {
    navigate('/math-visualization');
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Animate the elements
    const interval = setInterval(() => {
      setAnimatedElements(prevElements => 
        prevElements.map(el => {
          // Calculate new position
          let newY = el.y + el.speed;
          if (newY > 100) newY = -10;
          
          // Slight horizontal movement
          let newX = el.x + Math.sin(newY / 20) * 2;
          if (newX < 0) newX = 100;
          if (newX > 100) newX = 0;
          
          // Gentle rotation
          const newRotation = el.rotation + 0.2 * el.speed;
          
          return { ...el, x: newX, y: newY, rotation: newRotation };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Parallax effect for the grid
  const gridTransform = {
    transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
  };

  return (
    <section 
      className={`hero-section ${isVisible ? 'visible' : ''}`} 
      ref={heroRef} 
      onMouseMove={handleMouseMove}
    >
      <div className="grid-background" style={gridTransform}></div>
      
      <div className="hero-ambient-glow"></div>
      
      <div className="animated-elements">
        {animatedElements.map(element => (
          <div 
            key={element.id}
            className="floating-element"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
              transform: `rotate(${element.rotation}deg)`,
              opacity: 0.8 - (Math.abs(50 - element.y) / 100)
            }}
          >
            {element.icon}
          </div>
        ))}
      </div>
      
      <div className="hero-content">
        <h1 className="animated fade-in-up">
          Sketch <span className="highlight">Mentor</span>
        </h1>
        <p className="animated fade-in-up delay-1">
          Your AI-powered learning assistant
        </p>
        <h2 className="animated fade-in-up delay-2">
          Bring your learning to life
        </h2>
        
        <div className="feature-pills animated fade-in-up delay-3">
          <div className="pill" onClick={handleAICanvasClick} role="button" tabIndex="0">
            <span className="pill-icon">✏️</span>
            <span>AI Canvas</span>
          </div>
          <div className="pill" onClick={handleVideoGeneratorClick} role="button" tabIndex="0">
            <span className="pill-icon">🎬</span>
            <span>Video Generator</span>
          </div>
         
        </div>
      </div>
      
      <div className="hero-blob"></div>
      <div className="hero-blob secondary"></div>
    </section>
  );
}

export default HeroSection;
