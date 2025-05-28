import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Study } from './pages/Study';
import { Recent } from './pages/Recent';
import './index.css';

// Project 2 imports
import { useAuthState } from 'react-firebase-hooks/auth';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import DeepTutorSection from './components/DeepTutorSection';
import UserDashboard from './components/UserDashboard';
import { auth } from './firebase';

// Project 2 components
import SketchMentorUI from "./components/SketchMentorUI";
import Home2 from './components/Home';
import Solve from './components/solve';
import MathVisualization from './components/MathVisualization';
import Visual from './components/Visual';
import Transcript from './components/Transcript';

// Landing page for redirection
import LandingPage from './components/LandingPage';

function App() {
  const [user] = useAuthState(auth);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing page for project selection */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Original Project 1 routes with Layout and all functionality preserved */}
        <Route path="/project1" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="study/:id" element={<Study />} />
          <Route path="recent" element={<Recent />} />
        </Route>
        
        {/* Keep original Project 1 routes working as before */}
        <Route element={<Layout />}>
          <Route path="/study/:id" element={<Study />} />
          <Route path="/recent" element={<Recent />} />
        </Route>
        
        {/* Project 2 main route */}
        <Route path="/project2" element={
          <div className="app">
            <Header />
            <main>
              {user ? (
                <UserDashboard />
              ) : (
                <>
                  <HeroSection />
                  <DeepTutorSection />
                </>
              )}
            </main>
          </div>
        } />
        
        {/* Project 2 additional routes */}
        <Route path="/sketch-mentor" element={<SketchMentorUI />} />
        <Route path="/hero" element={<HeroSection />} />
        <Route path="/home" element={<Home2 />} />
        <Route path='/solve' element={<Solve />} />
        <Route path='/math-visualization' element={<MathVisualization />} />
        <Route path='/visual' element={<Visual />} />
        <Route path='/transcript' element={<Transcript />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;