import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom'
import myVideo from '../assets/hero-bg.mp4';
import { MoveUpRightIcon, X } from "lucide-react"

function Home() {

    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

        <div>
            I am another section
        </div>

    </>
  )
}

export default Home