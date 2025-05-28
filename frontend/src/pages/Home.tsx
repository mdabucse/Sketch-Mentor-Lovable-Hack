import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, BookOpen, Brain, Sparkles, Music, Video, FileText, Presentation } from "lucide-react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./Home.css";

export function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // Floating elements state
  const [floatingElements, setFloatingElements] = useState([
    { id: 1, icon: '📚', size: 40, x: 15, y: 20, speed: 0.5, rotation: 0 },
    { id: 2, icon: '📝', size: 45, x: 75, y: 30, speed: 0.7, rotation: 15 },
    { id: 3, icon: '🧠', size: 35, x: 40, y: 60, speed: 0.6, rotation: -10 },
    { id: 4, icon: '💡', size: 42, x: 85, y: 70, speed: 0.55, rotation: 5 },
    { id: 5, icon: '🎓', size: 48, x: 25, y: 80, speed: 0.65, rotation: -5 },
    { id: 6, icon: '📄', size: 38, x: 65, y: 15, speed: 0.45, rotation: 10 },
    { id: 7, icon: '🎧', size: 36, x: 90, y: 40, speed: 0.75, rotation: -15 },
    { id: 8, icon: '🎬', size: 40, x: 10, y: 45, speed: 0.6, rotation: 8 }
  ]);

  // Mouse move handler for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (heroRef.current) {
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      setMousePosition({ x, y });
    }
  };

  // Initialize animations and floating elements
  useEffect(() => {
    setIsVisible(true);
    
    // Animate the floating elements
    const interval = setInterval(() => {
      setFloatingElements(prevElements => 
        prevElements.map(el => {
          // Calculate new position
          let newY = el.y + el.speed;
          if (newY > 100) newY = -10;
          
          // Slight horizontal movement
          let newX = el.x + Math.sin(newY / 20) * 1.5;
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      // Document formats
      "application/pdf": [".pdf"],
      "text/plain": [".txt"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      // Audio formats
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "audio/m4a": [".m4a"],
      "audio/ogg": [".ogg"],
      // Video formats
      "video/mp4": [".mp4"],
      "video/x-msvideo": [".avi"],
      "video/quicktime": [".mov"],
      "video/x-matroska": [".mkv"],
    },
    multiple: false,
  });

  // Helper function to determine file type
  const getFileType = (file: File) => {
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.includes('presentation')) return 'presentation';
    if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('text')) return 'document';
    return 'document';
  };

  // Render upload icon based on file type
  const renderUploadIcon = (file: File | null) => {
    if (!file) return <Upload className="h-16 w-16 text-blue-400 mx-auto mb-4 upload-icon-pulse" />;

    const fileType = getFileType(file);
    switch (fileType) {
      case 'audio':
        return <Music className="h-16 w-16 text-indigo-400 mx-auto mb-4 upload-icon-pulse" />;
      case 'video':
        return <Video className="h-16 w-16 text-purple-400 mx-auto mb-4 upload-icon-pulse" />;
      case 'presentation':
        return <Presentation className="h-16 w-16 text-pink-400 mx-auto mb-4 upload-icon-pulse" />;
      default:
        return <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4 upload-icon-pulse" />;
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });
      navigate(`/study/${response.data.id}`);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-400" />,
      title: "Smart Summaries",
      description: "AI-powered document analysis for quick understanding",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-400" />,
      title: "Interactive Learning",
      description: "Flashcards and quizzes generated automatically",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-pink-400" />,
      title: "AI Assistant",
      description: "Chat with AI to clarify concepts and deepen understanding",
    },
  ];

  // Parallax effect for the grid
  const gridTransform = {
    transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
  };

  return (
    <div 
      className={`home-container ${isVisible ? 'visible' : ''}`}
      ref={heroRef}
      onMouseMove={handleMouseMove}
    >
      {/* Background elements */}
      <div className="grid-background" style={gridTransform}></div>
      <div className="ambient-glow"></div>
      
      {/* Floating elements */}
      <div className="floating-elements-container">
        {floatingElements.map(element => (
          <div 
            key={element.id}
            className="floating-element"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              fontSize: `${element.size}px`,
              transform: `rotate(${element.rotation}deg)`,
              opacity: 0.7 - (Math.abs(50 - element.y) / 150)
            }}
          >
            {element.icon}
          </div>
        ))}
      </div>

      <div className="content-wrapper">
        {/* Title & Description */}
        <div className="title-section animated fade-in-up">
          <h1 className="main-title">
            <span className="gradient-text">Transform Your Study Material</span>
          </h1>
          <p className="subtitle">
            Upload your documents and let AI create interactive study materials
          </p>
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card animated fade-in-up delay-${index}`}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Upload Section */}
        <div className="upload-section animated fade-in-up delay-3">
          <div {...getRootProps()} className={`upload-zone ${isDragActive ? "dragging" : ""}`}>
            <input {...getInputProps()} />
            <div className="upload-content">
              {renderUploadIcon(file)}
              <h3 className="upload-title">
                {file ? file.name : "Drop your file here"}
              </h3>
              <p className="upload-description">
                Support for PDF, TXT, DOCX, PPTX files
                <br />
                Now supporting Audio (MP3, WAV, M4A, OGG) and Video (MP4, AVI, MOV, MKV)
              </p>
            </div>
          </div>

          {uploading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${uploadProgress}%` }} 
                />
              </div>
              <p className="progress-text">
                {file && getFileType(file) !== 'document'
                  ? "Transcribing and processing..."
                  : "Uploading..."} {uploadProgress}%
              </p>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="cta-button"
          >
            {uploading
              ? (file && getFileType(file) !== 'document'
                ? "Transcribing..."
                : "Processing...")
              : "Generate Study Materials"}
          </button>
        </div>
      </div>
      
      {/* Decorative blobs */}
      <div className="blob primary"></div>
      <div className="blob secondary"></div>
    </div>
  );
}