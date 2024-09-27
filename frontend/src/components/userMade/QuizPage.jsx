        import React, { useState, useEffect } from 'react';
        import axios from 'axios';
        import { useAuth } from '@/AuthContext';
        import { useNavigate, useParams } from 'react-router-dom';
        import Timer from '../Timer/Timer';
        import Loading from '../loading/Loading';

        const QuizPage = () => {
            const { quiz_id } = useParams();  // get quiz_id from URL params
            
            
            const navigate = useNavigate();
            const [hasAttempted, setHasAttempted] = useState(false);

            const [questions, setQuestions] = useState([]);
            const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
            const [currentAnswer, setCurrentAnswer] = useState(null);
            const [score, setScore] = useState(0);
            const [timeStarted, setTimeStarted] = useState(null);
            
            const username = localStorage.getItem('username');

            const[quizStarted, setQuizStarted] = useState(false);
            const[timerLimit, setTimerLimit] = useState(0);

            
            const [loading, setLoading] = useState(false); // Add loading state
        


            useEffect(() => {
                    const checkIfAttempted = async () => {
                        try {
                            const response = await fetch(`http://localhost:5000//api/quiz/${quiz_id}/attempted/${username}`);
                            const data = await response.json();
                            if (data.attempted) {
                                setHasAttempted(true);
                                // Redirect or show a message if already attempted
                                alert('You have already attempted the quiz!')
                                navigate(`/`); // Redirect to a "quiz submitted" page
                            }
                        } catch (error) {
                            console.error("Error checking quiz attempt status:", error);
                        }
                    };
            
                checkIfAttempted();
                const fetchQuiz = async () => {
                    setLoading(true);

                    try {
                        const response = await axios.get(`http://localhost:5000/api/quiz/${quiz_id}`);
                        setQuestions(response.data.questions);
                        const timeInSeconds = response.data.time_limit* 60; // Convert minutes to seconds
                        setTimerLimit(timeInSeconds);
                        setQuizStarted(true);
                        setTimeStarted(Date.now());  // Start the timer
                    } catch (error) {
                        console.error('Error fetching quiz:', error);
                    }finally{
                        setLoading(false);
                    }
                };
                fetchQuiz();
            }, [quiz_id, username, navigate]);

            const handleAnswerClick = async (option) => {

                
                const questionDetails = {
                    question: questions[currentQuestionIndex].question,
                    correctAnswer: questions[currentQuestionIndex].answer,
                    userAnswer: option,
                    explanation: questions[currentQuestionIndex].explanation,
                    quiz_id: quiz_id,
                    username: username,
                };

                try {
                    await axios.post(`http://localhost:5000/api/questionattempted/`, questionDetails);
                } catch (error) {
                    console.error('Error submitting answers:', error);
                }


                setCurrentAnswer(option);
                if (option === questions[currentQuestionIndex].answer) {
                    setScore(score + 1);
                }
            };

            const handleNextQuestion = () => {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setCurrentAnswer(null);
            };

            const handleSubmitQuiz = async () => {
                const timeTaken = (Date.now() - timeStarted) / 1000;  // Time in seconds
                try {
                    await axios.post(`http://localhost:5000/api/quiz/${quiz_id}/submit`, {
                        username: username,
                        score: score,
                        time_taken: timeTaken
                    });
                    navigate(`/result/${quiz_id}/${username}`);
                } catch (error) {
                    console.error('Error submitting quiz:', error);
                }
            };

            useEffect(() => {
                if (quizStarted) {
                    const timerId = setInterval(() => {
                        if (timerLimit <= 0) {
                            clearInterval(timerId);
                            handleSubmitQuiz(); // Submit the quiz when time runs out
                        } else {
                            setTimerLimit((prev) => prev - 1); // Decrease timer
                        }
                    }, 1000);

                    return () => clearInterval(timerId); // Cleanup on component unmount
                }
            }, [quizStarted, timerLimit]);

            return (
                <div className='h-[40vw] relative '>

                    {loading && (
                                // Loading spinner overlay
                        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                                    <Loading type="bars" color="#3565EC" />
                        </div>
                    )}

                    {quizStarted &&
                        <Timer initialTime={timerLimit} />
                    }
                    
                    {currentQuestionIndex < questions.length ? (
                        <div className='flex justify-start w-[70%] flex-col pl-[1vw] pt-[3vw]'>
                            <div className=''>
                                
                                <h2 className="pt-[5vw] text-center text-4xl font-semibold transition-transform duration-300 transform hover:scale-105 ">
                                    {questions[currentQuestionIndex].question}
                                </h2>
                                <ul className="text-center mt-7">
                                    {questions[currentQuestionIndex].options.map((option, index) => (
                                        <li
                                            className={`block mx-auto mt-2 p-2 max-w-lg bg-gray-200 hover:bg-gray-400 font-bold py-2 px-4 rounded cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:opacity-90 ${currentAnswer === option ? 'selected' : ''}`}
                                            key={index}
                                            onClick={() => handleAnswerClick(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                disabled={currentAnswer === null}
                                className={`font-bold py-2 px-4 transform transition-all duration-100 border-2 border-gray-600 rounded-md p-2 block mx-auto mt-12 ${currentAnswer === null ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-gray-200 hover:bg-gray-400 cursor-pointer hover:shadow-xl hover:scale-105 hover:opacity-100'}`}
                                onClick={handleNextQuestion}
                            >
                                Next Question
                            </button>
                        </div>
                    ) : (
                        <div className='w-full flex flex-row items-center justify-center h-[34vw]'>
                            
                            <button
                                className=" bg-green-500 hover:scale-[0.99] active:scale-[0.98] hover:bg-green-600 text-white font-bold py-[1.5vw] px-[3vw] rounded mt-5"
                                onClick={handleSubmitQuiz}
                            >
                                Submit Quiz
                            </button>

                        </div>
                    )}
                </div>
            );
        };

        export default QuizPage;
