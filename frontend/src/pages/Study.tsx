//study
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { FileDown, MessageSquare, ArrowLeft, Target, Video } from 'lucide-react';
import { Chat } from '../components/Chat';
import { motion } from 'framer-motion';
import './study.css';  // if your CSS is in the styles folder
interface FlashCard {
    0: string;
    1: string;
}

interface QuizQuestion {
    question: string;
    possible_answers: string[];
    index: number;
}

interface StudyData {
    summary: string;
    flash_cards: FlashCard[];
    quiz: QuizQuestion[];
    title: string;
}

interface VideoResult {
    primary_video: string;
    additional_videos: string[];
}

export function Study() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<StudyData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz' | 'goals' | 'videos'>('summary');
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [videoQuery, setVideoQuery] = useState('');
    const [videoResults, setVideoResults] = useState<VideoResult | null>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:5000/fetch_id', { id });
                setData(response.data);
                setSelectedAnswers(new Array(response.data.quiz.length).fill(-1));
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleVideoSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoQuery.trim()) return;

        setIsLoadingVideo(true);
        try {
            const response = await axios.post('http://localhost:5000/search_videos', { query: videoQuery });
            setVideoResults(response.data);
        } catch (error) {
            console.error('Failed to search videos:', error);
        } finally {
            setIsLoadingVideo(false);
        }
    };

    const handleExport = async (selected: number) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/export',
                { selected, data },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${['Summary', 'Flashcards', 'Quiz'][selected]}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Export failed:', error);
        }
    };

    const FlashCardComponent = () => (
        <div className="space-y-6">
            <div className="relative h-64">
                <div
                    className="absolute w-full h-full cursor-pointer"
                    onClick={() => setFlipped(!flipped)}
                    style={{
                        perspective: '1000px',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s',
                        transform: flipped ? 'rotateY(180deg)' : ''
                    }}
                >
                    {/* Front of card */}
                    <div className="absolute w-full h-full bg-white rounded-xl p-6 flex items-center justify-center text-center shadow-lg"
                        style={{ backfaceVisibility: 'hidden' }}>
                        <p className="text-xl font-medium text-gray-800">{data?.flash_cards[currentCard][0]}</p>
                    </div>
    
                    {/* Back of card */}
                    <div className="absolute w-full h-full bg-blue-50 rounded-xl p-6 flex items-center justify-center text-center shadow-lg"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                        <p className="text-xl font-medium text-gray-800">{data?.flash_cards[currentCard][1]}</p>
                    </div>
                </div>
            </div>
    
            <div className="flex justify-between items-center">
                <button
                    onClick={() => {
                        setCurrentCard(prev => prev - 1);
                        setFlipped(false);
                    }}
                    disabled={currentCard === 0}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <span className="font-medium">
                    Card {currentCard + 1} of {data?.flash_cards.length}
                </span>
                <button
                    onClick={() => {
                        setCurrentCard(prev => prev + 1);
                        setFlipped(false);
                    }}
                    disabled={data ? currentCard === data.flash_cards.length - 1 : true}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
            
            {/* Added Export Button for Flashcards */}
            <button
                onClick={() => handleExport(1)}
                className="w-full px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 mt-4"
            >
                <FileDown className="h-5 w-5" />
                <span>Export Flashcards</span>
            </button>
        </div>
    );
    
    // Modified QuizComponent
const QuizComponent = () => (
    <div className="space-y-6">
        {!showResults ? (
            <>
                {data?.quiz?.map((question, index) => (
                    <div key={index} className="bg-white/50 rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-medium text-gray-800">
                            Question {index + 1}: {question.question}
                        </h3>
                        <div className="space-y-2">
                            {question.possible_answers.map((answer, answerIndex) => (
                                <button
                                    key={answerIndex}
                                    onClick={() => {
                                        const newAnswers = [...selectedAnswers];
                                        newAnswers[index] = answerIndex;
                                        setSelectedAnswers(newAnswers);
                                    }}
                                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                                        selectedAnswers[index] === answerIndex
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => setShowResults(true)}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    Submit Quiz
                </button>
            </>
        ) : (
            <div className="space-y-6">
                <div className="bg-white/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">Quiz Results</h3>
                    <p className="text-lg mb-4">
                        Score:{' '}
                        {data?.quiz?.reduce((acc, question, index) => {
                            return acc + (selectedAnswers[index] === question.index ? 1 : 0);
                        }, 0)}{' '}
                        / {data?.quiz.length}
                    </p>
                    
                    {/* Answer Review Section */}
                    <div className="space-y-6 mt-6">
                        {data?.quiz.map((question, qIndex) => (
                            <div key={qIndex} className="border-b pb-4">
                                <p className="font-medium mb-2">
                                    Question {qIndex + 1}: {question.question}
                                </p>
                                <div className="space-y-2">
                                    {question.possible_answers.map((answer, aIndex) => (
                                        <div
                                            key={aIndex}
                                            className={`p-3 rounded-lg ${
                                                question.index === aIndex
                                                    ? 'bg-green-100 border border-green-500'
                                                    : selectedAnswers[qIndex] === aIndex
                                                    ? 'bg-red-100 border border-red-500'
                                                    : 'bg-white'
                                            }`}
                                        >
                                            {answer}
                                            {question.index === aIndex && (
                                                <span className="ml-2 text-green-600">✓ Correct Answer</span>
                                            )}
                                            {selectedAnswers[qIndex] === aIndex && 
                                             question.index !== aIndex && (
                                                <span className="ml-2 text-red-600">✗ Your Answer</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => {
                        setShowResults(false);
                        setSelectedAnswers(new Array(data?.quiz.length).fill(-1));
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    Retry Quiz
                </button>
                <button
                    onClick={() => handleExport(2)}
                    className="w-full px-4 py-2 rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                    <FileDown className="h-5 w-5" />
                    <span>Export Quiz</span>
                </button>
            </div>
        )}
    </div>
);

    const GoalsComponent = () => {
        const [goalInput, setGoalInput] = useState('');
        const [goalAdvice, setGoalAdvice] = useState(() => {
            return localStorage.getItem('goalAdvice') || '';
        });
        const [todoTasks, setTodoTasks] = useState<Array<{ task: string; completed: boolean }>>(() => {
            const savedTasks = localStorage.getItem('todoTasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        });
        const [isLoadingGoal, setIsLoadingGoal] = useState(false);
        const [error, setError] = useState('');
    
        useEffect(() => {
            localStorage.setItem('goalAdvice', goalAdvice);
        }, [goalAdvice]);
    
        useEffect(() => {
            localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
        }, [todoTasks]);
    
        const handleGoalSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!goalInput.trim()) return;
    
            setIsLoadingGoal(true);
            setError('');
    
            try {
                const adviceResponse = await axios.post('http://localhost:5000/goaladvise', { goal: goalInput });
                setGoalAdvice(adviceResponse.data.advice);
    
                const todoResponse = await axios.post('http://localhost:5000/generatetodotask', { goal: goalInput });
                if (todoResponse.data.error) {
                    setError(todoResponse.data.error);
                } else if (todoResponse.data.generated && todoResponse.data.generated.tasks) {
                    const formattedTasks = todoResponse.data.generated.tasks.map((task: string) => ({
                        task,
                        completed: false
                    }));
                    setTodoTasks(formattedTasks);
                }
            } catch (error) {
                setError('Failed to process goal. Please try again.');
                console.error('Failed to process goal:', error);
            } finally {
                setIsLoadingGoal(false);
                setGoalInput('');
            }
        };
    
        const toggleTaskCompletion = (index: number) => {
            const updatedTasks = todoTasks.map((task, i) => 
                i === index ? { ...task, completed: !task.completed } : task
            );
            setTodoTasks(updatedTasks);
        };
    
        const clearGoals = () => {
            setGoalAdvice('');
            setTodoTasks([]);
            localStorage.removeItem('goalAdvice');
            localStorage.removeItem('todoTasks');
        };
    
        return (
            <div className="space-y-8">
                {/* Goal Input Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Set Your Learning Goal</h2>
                    <form onSubmit={handleGoalSubmit} className="space-y-4">
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                value={goalInput}
                                onChange={(e) => setGoalInput(e.target.value)}
                                placeholder="Enter your learning goal..."
                                className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={isLoadingGoal}
                                className="px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
                            >
                                <Target className="h-5 w-5" />
                                <span>{isLoadingGoal ? 'Processing...' : 'Analyze Goal'}</span>
                            </button>
                        </div>
                    </form>
                </div>
    
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">
                        {error}
                    </div>
                )}
    
                {/* Goal Analysis Section */}
                {goalAdvice && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Goal Analysis</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {goalAdvice.split('\n').map((paragraph, index) => (
                                    <span key={index}>
                                        {paragraph}
                                        <br />
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                )}
    
                {/* Action Items Section */}
                {todoTasks.length > 0 && (
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Action Items</h2>
                        <div className="space-y-3">
                            {todoTasks.map((task, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors group"
                                >
                                    <button
                                        onClick={() => toggleTaskCompletion(index)}
                                        className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center hover:bg-blue-50 transition-colors"
                                    >
                                        {task.completed && (
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        )}
                                    </button>
                                    <span 
                                        className={`text-gray-700 flex-1 ${
                                            task.completed 
                                                ? 'line-through text-gray-400' 
                                                : 'text-gray-700'
                                        }`}
                                    >
                                        {task.task}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
    
                {/* Clear Button */}
                {(goalAdvice || todoTasks.length > 0) && (
                    <div className="flex justify-end">
                        <button
                            onClick={clearGoals}
                            className="px-6 py-3 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                        >
                            Clear All Goals
                        </button>
                    </div>
                )}
            </div>
        );
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-medium">Loading...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-medium">No data found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 rounded-full hover:bg-white/50 transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-800">{data.title}</h1>
                    </div>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                        <MessageSquare className="h-5 w-5" />
                        <span>{showChat ? 'Hide Chat' : 'Show Chat'}</span>
                    </button>
                </div>

                <div className="flex space-x-6">
                    <div className="flex-1">
                        <div className="bg-white/30 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                {(['summary', 'flashcards', 'quiz', 'goals', 'videos'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                            ? 'bg-white/30 text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/10'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6">
                                {activeTab === 'summary' && (
                                    <div className="prose max-w-none">
                                        <ReactMarkdown>{data.summary}</ReactMarkdown>
                                        <button
                                            onClick={() => handleExport(0)}
                                            className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                                        >
                                            <FileDown className="h-5 w-5" />
                                            <span>Export Summary</span>
                                        </button>
                                    </div>
                                )}

                                {activeTab === 'flashcards' && <FlashCardComponent />}

                                {activeTab === 'quiz' && <QuizComponent />}

                                {activeTab === 'goals' && <GoalsComponent />}

                                {activeTab === 'videos' && (
                                    <div className="space-y-6">
                                        <form onSubmit={handleVideoSearch} className="space-y-4">
                                            <div className="flex space-x-4">
                                                <input
                                                    type="text"
                                                    value={videoQuery}
                                                    onChange={(e) => setVideoQuery(e.target.value)}
                                                    placeholder="Search for relevant educational videos..."
                                                    className="flex-1 p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={isLoadingVideo}
                                                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
                                                >
                                                    <Video className="h-5 w-5" />
                                                    <span>{isLoadingVideo ? 'Searching...' : 'Search'}</span>
                                                </button>
                                            </div>
                                        </form>

                                        {videoResults && (
                                            <div className="space-y-4">
                                                {videoResults.primary_video && (
                                                    <div className="bg-white/50 rounded-lg p-4">
                                                        <h3 className="font-bold text-lg mb-2">Primary Video:</h3>
                                                        <a
                                                            href={videoResults.primary_video}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline break-all"
                                                        >
                                                            {videoResults.primary_video}
                                                        </a>
                                                    </div>
                                                )}

                                                {videoResults.additional_videos?.length > 0 && (
                                                    <div className="bg-white/50 rounded-lg p-4">
                                                        <h3 className="font-bold text-lg mb-2">Additional Videos:</h3>
                                                        <ul className="space-y-2">
                                                            {videoResults.additional_videos.map((video, index) => (
                                                                <li key={index}>
                                                                    <a
                                                                        href={video}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:underline break-all"
                                                                    >
                                                                        {video}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {showChat && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="w-96"
                        >
                            <Chat />


                        </motion.div>
                    )}</div>

            </div>
        </div>
    );
}