import React from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom'
import myVideo from '../assets/hero-bg.mp4';
import { MoveUpRightIcon } from "lucide-react"

function Home() {
  return (
    <>
        <nav>
            {/* nav comes here */}
        </nav>
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover hidden md:block opacity-60"
                >
                    <source src={myVideo} type="video/mp4" />
                </video>

                <div className="absolute top-0 left-0 w-full h-full block md:hidden bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 opacity-80 -z-10"></div>

                <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0"></div>

                <div className='absolute max-w-4xl mx-auto left-40 bottom-40'>
                    <motion.h1
                    initial={{opacity: 0, y: 40}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='text-white text-7xl my-4'>Beat the ATS. <br /> Land the interview</motion.h1>
                    <Link to='/register' className='inline-block rounded-4xl text-xl bg-white hover:bg-white/80 text-black px-6 py-5 mt-10'>
                        Start Free Analysis
                    </Link>
                </div>

        </div>

        <div>
            I am another section
        </div>

    </>
  )
}

export default Home