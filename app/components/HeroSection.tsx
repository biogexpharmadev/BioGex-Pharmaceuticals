"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ExternalLink } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const slides = [
  {
    image: "/greenpillsgreenbg.jpg",
    title: "Empowering Healthcare for a Better Tomorrow",
    subtitle:
      "We are a trusted provider of high-quality affordable pharmaceutical products.",
  },
  {
    image: "/biogexx.png",
    title: "Global Distribution Network",
    subtitle:
      "Connecting healthcare providers worldwide with premium pharmaceutical products and reliable supply chains.",
  },
  {
    image: "/hero.png",
    title: "Innovation in Healthcare",
    subtitle: "Pioneering the future of pharmaceutical distribution through cutting-edge technology and expertise.",
  },
  {
    image: "/pillbottlespill.jpg",
    title: "Quality You Can Trust",
    subtitle: "Ensuring the highest standards in pharmaceutical quality control and regulatory compliance.",
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Debug logging removed

  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openProductSheet = () => {
    window.location.href = "/products"
  }

  // Animation variants
  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 1.1
    },
    visible: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0
    }
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: -20
    }
  }

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0
    },
    exit: {
      opacity: 0,
      y: 20
    }
  }

  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Animated Background Image */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide}
          className="absolute top-0 left-0 w-full h-full z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${slides[currentSlide].image})`,
            backgroundColor: '#1a1a1a' // Fallback color
          }}
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlay to prevent flash */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Welcome Banner */}
            <motion.div
              className="mb-4 sm:mb-6"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            >
              <span className="inline-block bg-[#2e7d32] text-white px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium">
                Welcome to BioGex Pharma
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-6 leading-tight tracking-tight text-white drop-shadow-lg"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 opacity-90 font-heading font-normal leading-relaxed max-w-3xl mx-auto text-white drop-shadow-lg"
              variants={textVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div
              className="flex flex-row gap-2 sm:gap-4 justify-center"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            >
              <motion.button
                onClick={scrollToContact}
                className="group bg-[#2e7d32] text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-[#1b5e20] transition-all duration-300 hover:shadow-lg hover:shadow-[#2e7d32]/30 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get a quote now
                <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </motion.button>

              <motion.button
                onClick={openProductSheet}
                className="group border-2 border-white text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-base font-semibold hover:bg-white hover:text-[#2e7d32] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-1 sm:gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Our Products
                <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 hover:scale-125 ${index === currentSlide
                ? "bg-gradient-to-r from-[#2e7d32] to-[#1b5e20] scale-125 shadow-lg shadow-[#2e7d32]/50"
                : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center backdrop-blur-sm bg-white/10">
          <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2 animate-pulse" />
        </div>
      </motion.div>
    </section>
  )
}
