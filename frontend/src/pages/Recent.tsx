//recent.tsx
import{ useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Clock, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import '../index.css';
interface RecentItem {
  id: string;
  title: string;
}

export function Recent() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/recent');
        setRecentItems(response.data.recent);
      } catch (error) {
        console.error('Failed to fetch recent items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-lg text-gray-600">Loading your study materials...</p>
      </div>
    );
  }

  if (recentItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 animate-bounce-slow">
          <Clock className="h-12 w-12 text-indigo-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No recent studies</h3>
        <p className="text-gray-600 mb-8 max-w-md">
          Start your learning journey by uploading a document to study
        </p>
        <Link
          to="/"
          className="cta-button inline-flex items-center space-x-2 group"
        >
          <BookOpen className="h-5 w-5" />
          <span>Upload Document</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Recent Studies</span>
          </h1>
          <Link
            to="/"
            className="cta-button inline-flex items-center space-x-2 group"
          >
            <BookOpen className="h-5 w-5" />
            <span>New Study</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/study/${item.id}`}
                className="block group"
              >
                <div className="feature-card h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-indigo-600" />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click to continue studying
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}