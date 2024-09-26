import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
const ResultQuiz = () => {
  return (
    <div className='max-w-screen'>


      <div className='h-[40vw] w-full flex flex-row'>

        <div className='w-[50%] h-full flex flex-col items-center justify-center text-center '>
        <h2 className="leading-[5vw] flex flex-row gap-[1vw] justify-center items-center text-[5vw] font-bold text-[#3565EC]">Your Score: <span className='text-yellow-500 flex'> 5 / 30 </span></h2>
        <p className='text-[1.5vw] font-semibold w-[65%] text-center'>Time Taken⏰: 30 secs  </p>
        <p className='text-[0.9vw] font-semibold w-[65%] text-center'>Visit quiz leaderboard page to see your rankings</p>
        <p className='font-semibold w-[65%] text-center italic text-[0.7vw]'>Scroll down to see the correct answers</p>
        </div>
        <div className='w-[50%] flex items-center justify-center h-full'>
            <Card className="w-[90%] min-h-[90%]">
      <CardHeader>
        <CardTitle className='text-[2vw] font-bold leading-[3vw]'>Personlized Feedback and Learning Paths</CardTitle>
        <CardDescription className='italic text-[0.8vw]'>This is AI generated feedback.</CardDescription>
      </CardHeader>
      <CardContent>
        <Card className='min-h-[26.5vw] p-[1vw] w-full shadow-none'>

            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ab minus impedit commodi expedita sequi quia deleniti, adipisci corrupti a soluta id incidunt nisi sapiente, consectetur ipsum doloremque voluptatem dolore?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ab minus impedit commodi expedita sequi quia deleniti, adipisci corrupti a soluta id incidunt nisi sapiente, consectetur ipsum doloremque voluptatem dolore?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ab minus impedit commodi expedita sequi quia deleniti, adipisci corrupti a soluta id incidunt nisi sapiente, consectetur ipsum doloremque voluptatem dolore?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ab minus impedit commodi expedita sequi quia deleniti, adipisci corrupti a soluta id incidunt nisi sapiente, consectetur ipsum doloremque voluptatem dolore?
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, ab minus impedit commodi expedita sequi quia deleniti, adipisci corrupti a soluta id incidunt nisi sapiente, consectetur ipsum doloremque voluptatem dolore?
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between">
      </CardFooter>
    </Card>

        </div>
      </div>

      <div className='my-[2vw] w-[90%] mx-auto'>
        <div>
          <h2 className='font-bold text-[3vw] mb-[2vw] '>Quiz Solutions and Explanation</h2>
        </div>
        <div className='h-full w-full '>
            <Card className="mb-[1.5vw] border-red-600 border-[0.2vw] bg-opacity-10 bg-red-500">
        <CardHeader>
        <CardTitle className='text-[1.6vw] font-bold leading-[3vw] text-gray-800'>Hey I'm Question 1, So below me, you'll find the pair of correct answer, your answer and explanation</CardTitle>
        </CardHeader>
        <CardContent>
                <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className='font-bold text-yellow-600'>Your Answer</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className='font-bold text-green-500'>Correct Answer</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className='font-bold text-gray-700'>Explanation</AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
        </Card>


        <Card className="mb-[1.5vw] border-green-500 border-[0.2vw] bg-opacity-10 bg-green-500">
        <CardHeader>
        <CardTitle className='text-[1.6vw] font-bold leading-[3vw] text-gray-800'>Hey I'm Question 1, So below me, you'll find the pair of correct answer, your answer and explanation</CardTitle>
        </CardHeader>
        <CardContent>
                <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className='font-bold text-yellow-600'>Your Answer</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className='font-bold text-green-500'>Correct Answer</AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other
                  components&apos; aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className='font-bold text-gray-700'>Explanation</AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
        </CardFooter>
        </Card>
    

        </div>
        </div>
    </div>
  )
}

export default ResultQuiz