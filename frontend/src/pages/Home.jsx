import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom'
import myVideo from '../assets/hero-bg.mp4';
import { MoveUpRightIcon, X } from "lucide-react"

function Home() {

    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [text, setText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [wordIndex, setWordIndex] = useState(0);

    const words = ["interviews", "callbacks", "offers", "careers"];

    useEffect(() => {
        const currentWord = words[wordIndex];
        let timeout;

        if (isDeleting) {
        // Backspacing speed
        timeout = setTimeout(() => {
            setText(currentWord.substring(0, text.length - 1));
            
            // When fully deleted, move to the next word and start typing
            if (text.length === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
            }
        }, 80); 
        } else {
        // Typing speed
        timeout = setTimeout(() => {
            setText(currentWord.substring(0, text.length + 1));
            
            // When word is fully typed, pause for 2 seconds before deleting
            if (text.length === currentWord.length) {
            timeout = setTimeout(() => setIsDeleting(true), 2000);
            }
        }, 200); 
        }

        return () => clearTimeout(timeout);
    }, [text, isDeleting, wordIndex]);

    // scroll effect to change nav bg
    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY >= window.innerHeight - 80){
                setIsScrolled(true)
            }else{
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    })
  return (
    <>
        <nav className={`fixed top-0 left-0 w-full py-4 z-50 flex justify-between items-center transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md text-black' : 'bg-transparent text-white'}`}>
            <div className='font-jetbrains font-extrabold tracking-tight text-2xl mx-5'>SkillSync</div>

            {/* Desktop Links */}
            <div className='hidden md:flex font-jetbrains gap-5 mx-5 font-medium items-center'>
                <Link className='relative group py-2' to='/login'>
                    Login
                    <span className='absolute bottom-1 left-0 w-0 h-0.5 bg-current transition-all duration-300 ease-out group-hover:w-full'></span>
                </Link>
                <Link className='border px-6 py-2 rounded-3xl hover:bg-white hover:text-black' to='/'>Try it Out</Link>
            </div>

            {/* hamburger button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex flex-col justify-center gap-1.5 mx-5 md:hidden w-8 h-8 cursor-pointer z-50"
            >
              <div className={`h-0.5 w-6 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></div>
              <div className={`h-0.5 w-6 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-white'}`}></div>
            </button>
        </nav>

        {/* Mobile Menu */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
          className="fixed font-jetbrains inset-0 bg-white z-60 flex flex-col p-6 md:hidden text-black shadow-2xl"
        >
          {/* Close Button Header */}
          <div className="flex justify-between items-center mt-2">
            <div className='font-black text-2xl tracking-tighter'>SkillSync</div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
              <X size={32} />
            </button>
          </div>

          {/* Menu Options */}
          <div className="flex flex-col gap-8 mt-16 text-3xl font-bold tracking-tight px-4">
            <Link to='/login' onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            <Link to='/' onClick={() => setIsMobileMenuOpen(false)}>Try it Out</Link>
          </div>
        </motion.div>


        {/* Hero section */}
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-gray-900">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover opacity-60"
                >
                    <source src={myVideo} type="video/mp4" />
                </video>

                <div className="absolute bottom-0 left-0 w-full h-[65%] bg-linear-to-t from-black via-black/70 to-transparent md:h-full md:bg-none z-10"></div>
                

                <div className='absolute z-20 w-full px-6 bottom-20 flex flex-col items-center text-center md:block md:w-auto md:px-0 md:text-left md:max-w-4xl md:mx-auto md:left-40 md:bottom-40'>
                    <motion.h1
                    initial={{opacity: 0, y: 40}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='text-white text-4xl md:text-7xl my-4'>Beat the ATS. <br /> Land the interview</motion.h1>
                    <Link to='/register' className='inline-block rounded-4xl text-xl bg-white hover:bg-white/80 text-black px-6 py-5 mt-6 md:mt-10'>
                        Start Free Analysis
                    </Link>
                </div>

        </div>

        {/* info section */}
        <div className="w-full bg-[#FCFBF4] py-24 px-6 md:py-32 md:px-12 flex justify-center border-t border-gray-200">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
                
                {/* Left column*/}
                <div className="flex flex-col justify-start">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Decoding the algorithms to unlock <br className="hidden md:block" />
                        
                        <span className="text-blue-600 font-jetbrains mt-4 inline-block h-[1.2em]">
                            {text}
                            <span className="animate-pulse font-normal text-blue-500">_</span>
                        </span>
                    </h2>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-6 text-lg md:text-xl text-gray-600 font-medium leading-relaxed md:pl-10">
                    <p>
                        Our AI parsing engine translates complex job descriptions into a precise, step-by-step roadmap. In seconds, SkillSync analyzes your resume exactly how enterprise tracking systems do, pinpointing hidden formatting traps and missing keywords.
                    </p>
                    <p>
                        This technology eliminates the guesswork from the job hunt, giving highly qualified candidates the unfair advantage they need to bypass the algorithm and get their resume in front of a human.
                    </p>
                </div>
                
            </div>
        </div>

    </>
  )
}

export default Home