    import { Label } from '@radix-ui/react-label';
    import { Input } from "@/components/ui/input"
    import { TbRefresh } from "react-icons/tb";
    import React, { useEffect, useState } from 'react'

    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card"


    import { Textarea } from '../ui/textarea';
    import { Button } from '../ui/button';
    import { BiArrowBack } from "react-icons/bi";
    import { useNavigate } from 'react-router-dom';
    import { IoTimerOutline } from "react-icons/io5";
    import axios from 'axios';

    import { Bounce, toast, ToastContainer } from "react-toastify";
    import 'react-toastify/dist/ReactToastify.css';
    import { useAuth } from "@/AuthContext";


    const JoinBattle = () => {

        const [battles, setBattles] = useState([]);
        // Fetch battles from API

        const {isAuthenticated} = useAuth();
        const navigate = useNavigate();
        const username = localStorage.getItem('username');  // Get the username from local storage

        useEffect(() => {
            const fetchBattles = async () => {
                try {
                    const response = await axios.get('http://localhost:5000/api/battles');
                    console.log(response.data)
                    setBattles(response.data);
                } catch (error) {
                    console.error('Error fetching battles:', error);
                }
            };

            fetchBattles();
        }, []);
        
        const notify = () => toast("Page refreshed!");
        const notifyJoin = () => toast("You have already attempted the quiz!");

        const handleRefreshButton = async ()=>{
            try {
                const response = await axios.get('http://localhost:5000/api/battles');
                setBattles(response.data);
                notify();
                navigate('/joinbattle')
            } catch (error) {
                console.error('Error fetching battles:', error);
            }
        }
        const handleBackButton = () => {
            if(!isAuthenticated){
                navigate('/');
            }
            else{
                navigate('/battlepage');
            }
        }



        const handleLeaderBoard = ()=>{
            
            if(!isAuthenticated){
                navigate('/');
            }
            else{
                navigate('/leaderboard');
            }

        }

        const handleJoinButton = async (battleId) => {

            try {
                // Check if the user has already attempted the quiz
                const response = await axios.get(`http://localhost:5000/api/quiz/${battleId}/attempted/${username}`);
                
                if (response.data.attempted) {
                    notifyJoin();
                } else {
                    navigate(`/quiz/${battleId}`); // Proceed to the quiz page
                }
            } catch (error) {
                console.error("Error checking quiz attempt:", error);
                // Handle error (optional)
            }
        };
        return (
            // <h2 className="text-[4vw] font-bold text-[#3565EC]">Create a<span className='text-yellow-500'> Battle</span></h2>
            <div className="max-w-screen">
                            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition= {Bounce}
                />
                    <div className='flex h-[42vw]'>

                        <div className='w-[50%] h-full relative'>
                            <div onClick={handleBackButton} className='p-4 active:scale-105 rounded-full transition-all hoverease-in duration-150 hover:bg-gray-100 text-[2vw] absolute'><BiArrowBack/></div>
                            <div className='h-full justify-center flex flex-col items-center'>
                            <h2 className="leading-[5vw] flex flex-col justify-center items-center text-[5vw] w-full font-bold text-[#3565EC]">Join the <span className='text-yellow-500'>Battle Arena.</span></h2>
                            <p className='text-[1.5vw] font-semibold w-[65%] text-center'>Step into the action! Join the competitive quiz contest and prove your skills!</p>
                            </div>
                        </div>

                        <div className='w-[50%] flex justify-center'>


                            <Card className='w-[80%] h-[38vw] py-[1vw] border-none drop-shadow-none m-5 '>
                                
                                <CardHeader>
                                    <div className='flex justify-between items-center'>
                                    <CardTitle className='text-[2vw]'>Active Battles to Join</CardTitle>
                                    <TbRefresh onClick={handleRefreshButton} className='text-[2vw] active:scale-[0.9] rounded-full hover:bg-gray-100 p-1' />
                                    </div>
                                    <CardDescription>Click on the quiz card to see the contest leaderboard.</CardDescription>
                                </CardHeader>   
                            <CardContent className='h-[30vw] overflow-y-scroll'>

                                    {/* ek to yeh , no battles active */}

                        {battles && battles.length > 0 ? (
                            battles.map((battle, index) => (
                                <Card key={index} onClick={handleLeaderBoard} className='flex flex-col p-[1vw] mb-[1vw] hover:cursor-pointer active:scale-[0.98] hover:scale-[0.99] transition-all duration-100 hover:bg-gray-50'>
                                    <div className='flex justify-end'>
                                        <div className='flex font-bold items-center justify-center'>
                                            <IoTimerOutline className='' />
                                            <h2>{battle.time || 'Time'}</h2>
                                        </div>
                                    </div>
                                    <div className='flex gap-[1vw] font-bold flex-row'>
                                        <div>
                                            <img className='h-[5vw]' src='./images/username.png' alt='User Avatar' />
                                            <h2>@{battle.username}</h2>
                                        </div>
                                        <div>
                                            <h2 className='text-[2vw]'>{battle.title}</h2>
                                            <h2 className='text-[1.5vw]'>{battle.description}</h2>
                                            <h2 className='text-[1vw]'>No. of Questions: {battle.num_questions}</h2>
                                        </div>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        
                                        <h2 className='text-[1vw]'>Deadline: {new Date(battle.deadline).toLocaleString() || 'N/A'}</h2>
                                        <Button onClick={(e) => {
                                            e.stopPropagation(); // Prevent the card's click handler from being triggered
                                            handleJoinButton(battle.id);
                                            // Add your join logic here
                                        }} className='bg-[#F47F2F] px-[1.5vw] py-[0.2vw] rounded-full'>Join</Button>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <Card className='flex justify-center items-center'>
                                <h2 className='text-[1vw]'>No Active Battles!</h2>
                            </Card>
                        )}

                            
                            </CardContent>
                            </Card>

                            


                        </div>
                    </div>
            </div>
    )
    }

    export default JoinBattle