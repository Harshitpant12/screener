import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom'
import myVideo from '../assets/hero-bg.mp4';
import { AlertTriangle, ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, Cpu, FileWarning, MoveUpRightIcon, Target, UploadCloud, X } from "lucide-react"

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
                <Link className={`border px-6 py-2 rounded-3xl ${isScrolled ? 'hover:bg-black hover:text-white' : 'hover:bg-white hover:text-black' } `} to='/'>Try it Out</Link>
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
                    <motion.Link
                    initial={{opacity: 0, y: 40}}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    to='/register'
                    className='inline-flex items-center rounded-4xl text-xl bg-white hover:bg-white/80 text-black px-6 py-5 mt-6 md:mt-10'>
                        Start Free Analysis <ArrowUpRight size={20} className='ml-2' />
                    </motion.Link>
                </div>

        </div>

        {/* info section */}
        <div className="w-full bg-[#FCFBF4] py-24 px-6 md:py-32 md:px-12 flex justify-center border-t border-gray-200">
            <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
                
                {/* Left column*/}
                <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2.0, ease: "easeOut" }}
                className="flex flex-col justify-start">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                        Decoding the algorithms to unlock <br className="hidden md:block" />
                        
                        <span className="text-blue-600 font-jetbrains mt-4 inline-block h-[1.2em]">
                            {text}
                            <span className="animate-pulse font-normal text-blue-500">_</span>
                        </span>
                    </h2>
                </motion.div>

                {/* Right column */}
                <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 2.0, ease: "easeOut" }}
                className="flex flex-col gap-6 text-lg md:text-xl text-gray-600 font-medium leading-relaxed md:pl-10">
                    <p>
                        Our AI parsing engine translates complex job descriptions into a precise, step-by-step roadmap. In seconds, SkillSync analyzes your resume exactly how enterprise tracking systems do, pinpointing hidden formatting traps and missing keywords.
                    </p>
                    <p>
                        This technology eliminates the guesswork from the job hunt, giving highly qualified candidates the unfair advantage they need to bypass the algorithm and get their resume in front of a human.
                    </p>
                </motion.div>
                
            </div>
        </div>

        {/* bento grid to build user trust */}
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2.0, ease: "easeOut" }}
            className="w-full bg-white py-24 px-6 md:py-32 flex justify-center"
        >
            <div className="max-w-6xl w-full flex flex-col gap-16">
                
                {/* Section Header */}
                <div className="flex flex-col items-center text-center gap-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
                        See exactly what the ATS sees.
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl">
                        Stop guessing why you were rejected. Our dashboard breaks down your resume line by line, exposing the hidden metrics recruiters use to filter you out.
                    </p>
                </div>

                {/* The Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: The Scorecard */}
                    <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col justify-between overflow-hidden relative group">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Resume Scoring</h3>
                            <p className="text-gray-500">We grade your resume against the exact job description.</p>
                        </div>
                        
                        {/* The Score Widget */}
                        <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between transition-transform duration-500 group-hover:-translate-y-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Match Rate</span>
                                <span className="text-5xl font-black text-green-500 tracking-tighter">84%</span>
                            </div>
                            <div className="text-right flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <CheckCircle2 size={16} className="text-green-500" /> Impact Quantified
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <CheckCircle2 size={16} className="text-green-500" /> Action Verbs Used
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Keyword Gap Analysis */}
                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200 flex flex-col relative group">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Keyword Gaps</h3>
                        <p className="text-gray-500 mb-8">Discover the mandatory skills your resume is missing.</p>
                        
                        {/* Missing Skills */}
                        <div className="flex flex-wrap gap-2 mt-auto transition-transform duration-500 group-hover:-translate-y-2">
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <AlertTriangle size={14} /> Docker
                            </span>
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <AlertTriangle size={14} /> CI/CD
                            </span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">React.js</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
                        </div>
                    </div>

                    {/* Card 3: Formatting Traps */}
                    <div className="md:col-span-3 bg-gray-900 rounded-3xl p-8 md:p-12 border border-gray-800 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden">
                        <div className="max-w-xl mb-8 md:mb-0">
                            <h3 className="text-2xl font-bold mb-2">Formatting Trap Detection</h3>
                            <p className="text-gray-400 text-lg">
                                Invisible tables, complex columns, and custom fonts break ATS parsers. We scan the underlying code of your PDF to ensure it is 100% machinen readable.
                            </p>
                        </div>
                        
                        {/* Scan Alert */}
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-start gap-4 w-full md:w-auto">
                            <div className="bg-red-500/20 p-3 rounded-full text-red-400">
                                <FileWarning size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-lg">Parser Error Detected</div>
                                <div className="text-sm text-gray-300">2 column layout found. <br/> Fix required for Workday ATS.</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>

        {/* pipeline or how it works section */}
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 2.0, ease: "easeOut" }}
            className="w-full bg-black py-24 px-6 md:py-32 flex justify-center border-t border-gray-800 relative overflow-hidden"
        >
            
            {/* Subtle Background Glow (the center one) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="max-w-6xl w-full relative z-10">
                
                {/* Section Header */}
                <div className="flex flex-col items-center text-center gap-4 mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                        Execute in three steps.
                    </h2>
                    <p className="text-lg text-gray-400 font-jetbrains">
                        No complex onboarding. Just upload and execute.
                    </p>
                </div>

                {/* The 3-Step Flow */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    
                    {/* Connecting Line of each steps on desktop */}
                    <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-gray-800 via-blue-900 to-gray-800 -z-10"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 group-hover:border-blue-500 transition-colors duration-300 relative">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <UploadCloud size={40} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">1. Upload Raw Data</h3>
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            Drop in your current PDF resume and paste the raw text of your target job description.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 group-hover:border-blue-500 transition-colors duration-300 relative">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Cpu size={40} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">2. NLP Parsing Engine</h3>
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            Our machine learning model rips apart your document, using natural language processing to score it exactly like an enterprise ATS.
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center text-center group">
                        <div className="w-24 h-24 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 group-hover:border-blue-500 transition-colors duration-300 relative">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Target size={40} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">3. Deploy & Dominate</h3>
                        <p className="text-gray-400 leading-relaxed max-w-xs">
                            Apply the exact recommended keyword injections and formatting fixes, then hit submit with confidence.
                        </p>
                    </div>

                </div>
            </div>
        </motion.div>

        {/* Infinite Scrolling section */}
        <div className="w-full bg-white py-10 border-t border-b border-gray-200 overflow-hidden flex flex-col items-center">
            <p className="text-sm font-jetbrains font-bold text-gray-400 uppercase tracking-widest mb-6">
                Engineered to bypass strict enterprise parsers
            </p>
            
            {/* Infinite Scrolling Container (This is the only part that moves) */}
            <div className="relative w-full max-w-7xl flex overflow-hidden group">
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ ease: "linear", duration: 15, repeat: Infinity }}
                    className="flex whitespace-nowrap gap-16 md:gap-32 items-center px-8"
                >
                    {["Workday", "Greenhouse", "Lever", "Taleo", "Ashby", "SmartRecruiters", "iCIMS", "Workday", "Greenhouse", "Lever", "Taleo", "Ashby", "SmartRecruiters", "iCIMS"].map((ats, idx) => (
                        <span key={idx} className="text-2xl md:text-3xl font-black text-gray-300 tracking-tighter">
                            {ats}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
                    
        {/* CTA & Footer sections */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full bg-black flex flex-col items-center pt-24 md:pt-32 border-t border-gray-900"
        >
            
            {/* Call to Action */}
            <div className="max-w-4xl w-full px-6 flex flex-col items-center text-center mb-24 md:mb-32 relative z-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6">
                    Stop getting ghosted <br className="hidden md:block" />
                    Start getting interviews
                </h2>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-medium">
                    Every day you apply without optimizing your resume is another opportunity lost to an automated filter. Take back control of your job hunt.
                </p>
                <Link 
                    to="/register" 
                    className="group relative inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-5 rounded-full text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                    Start Free Analysis
                    <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <p className="text-sm text-gray-600 mt-4 font-jetbrains">
                    No credit card required. Execution takes 30 seconds.
                </p>
            </div>

            {/* Footer Section */}
            <footer className="w-full border-t border-gray-800 bg-black pt-12 pb-8 px-6 flex justify-center">
                <div className="max-w-7xl w-full flex flex-col gap-8">
                    
                    {/* Top Row: Logo & Links */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                        
                        {/* Brand */}
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <div className="font-black text-2xl tracking-tighter text-white font-jetbrains">
                                SkillSync
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs text-center md:text-left">
                                The ultimate NLP parsing engine for modern full-stack developers and job seekers.
                            </div>
                        </div>

                        {/* Footer Navigation */}
                        <div className="flex gap-8 md:gap-16 text-sm font-medium">
                            <div className="flex flex-col gap-3 text-center md:text-left">
                                <span className="text-gray-400 uppercase tracking-wider text-xs mb-1">Product</span>
                                <Link to="/" className="text-gray-500 hover:text-white transition-colors">Scanner</Link>
                                <Link to="/" className="text-gray-500 hover:text-white transition-colors">Pricing</Link>
                                <Link to="/" className="text-gray-500 hover:text-white transition-colors">Changelog</Link>
                            </div>
                            <div className="flex flex-col gap-3 text-center md:text-left">
                                <span className="text-gray-400 uppercase tracking-wider text-xs mb-1">Legal</span>
                                <Link to="/" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                                <Link to="/" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Copyright */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-xs text-gray-600">
                        <p>&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <p>Built for the modern job market.</p>
                        </div>
                    </div>

                </div>
            </footer>
        </motion.div>


    </>
  )
}

export default Home