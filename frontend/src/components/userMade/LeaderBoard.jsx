
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


import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { IoTimerOutline } from "react-icons/io5";
import axios from 'axios';

import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "@/AuthContext";

const LeaderBoard = () => {

  
    const [battles, setBattles] = useState([]);
    // Fetch battles from API

    const {isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBattles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/battles');
                setBattles(response.data);
            } catch (error) {
                console.error('Error fetching battles:', error);
            }
        };

        fetchBattles();
    }, []);
    
    const notify = () => toast("Page refreshed!");

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
            navigate('/joinbattle');
        }
    }



  return (
    <div className="max-w-screen">

<div className='flex h-[42vw]'>

<div className='w-[50%] h-full relative'>
    <div onClick={handleBackButton} className='p-4 active:scale-105 rounded-full transition-all hoverease-in duration-150 hover:bg-gray-100 text-[2vw] absolute'><BiArrowBack/></div>
    <div className='h-full justify-center flex flex-col items-center'>
    <h2 className="leading-[5vw] flex flex-col justify-center items-center text-[5vw] w-full font-bold text-[#3565EC]">Quiz Contest <span className='text-yellow-500'>Leaderboard.</span></h2>
    <p className='text-[1.5vw] font-semibold w-[65%] text-center'>Join the AI quiz contest, challenge your skills, climb the leaderboard, and win exclusive rewards—are you up for the challenge?</p>
    </div>
</div>

<div className='w-[50%] flex justify-center'>


    <Card className='w-[80%] h-[38vw] py-[1vw] border-none drop-shadow-none m-5 '>
        
        <CardHeader>
            <div className='flex justify-between items-center'>
            <CardTitle className='text-[2vw]'>Quiz Leaderboard 🏆🚀</CardTitle>
            <TbRefresh onClick={handleRefreshButton} className='text-[2vw] active:scale-[0.9] rounded-full hover:bg-gray-100 p-1' />
            </div>
            <CardDescription></CardDescription>
        </CardHeader>   
    <CardContent className='h-[30vw] overflow-y-scroll'>

            {/* ek to yeh , no participants active */}

{battles && battles.length > 0 ? (
    battles.map((battle, index) => (
        <Card key={index} className='flex flex-col p-[1vw] mb-[1vw] drop-shadow-none'>
            <div className='flex justify-end'>
                <div className='absolute flex font-bold items-center justify-center'>
                    <IoTimerOutline className='' />
                    <h2>{battle.time || 'Time'}</h2>
                </div>
            </div>
            <div className='flex gap-[1.5vw] font-bold flex-row items-center '>
                <div>
                    <img className='h-[5vw]' src='./images/username.png' alt='User Avatar' />
                    {/* <h2>@{battle.username}</h2> */}
                </div>
                <div>
                    <h2 className='text-[2vw]'>@username</h2>
                    <h2 className='text-[1.5vw]'>30/50</h2>
                    <h2 className='text-[1vw]'>time taken 20 min</h2>
                </div>
            </div>
        </Card>
    ))
) : (
    <Card className='flex justify-center items-center'>
        <h2 className='text-[1vw]'>No one Participated till now !</h2>
    </Card>
)}

       
    </CardContent>
    </Card>

       


</div>
</div>
</div>
  )
}

export default LeaderBoard