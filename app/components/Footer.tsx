"use client"

import { useEffect, useState } from "react"
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin, ExternalLink } from "lucide-react"

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("footer")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openProductSheet = () => {
    window.location.href = "/products"
  }

  return (
    <footer id="footer" className="bg-gray-900 text-white relative overflow-hidden pb-8" data-aos="fade-up" data-aos-duration="800">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-50" />

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-screen-sm lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div
            className={`flex flex-col gap-y-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:space-y-0 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100"
          >
            {/* Column 1: Brand + Description + Social */}
            <div className="lg:col-span-1">
              <div className="mb-4 sm:mb-6">
                <div className="mb-3 sm:mb-4">
                  <img 
                    src="/logofullbgless.png" 
                    alt="BioGex Pharmaceuticals" 
                    className="h-8 sm:h-12 w-auto"
                  />
                </div>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4 sm:mb-6">
                  Leading pharmaceutical wholesale distributor committed to connecting healthcare providers with premium
                  medical products worldwide. 
                </p>
              </div>

              {/* Social Icons */}
              <div className="flex space-x-3 sm:space-x-4">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Linkedin, href: "#", label: "LinkedIn" },
                ].map((social, index) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="bg-gray-800 hover:bg-[#2e7d32] p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    style={{ transitionDelay: `${index * 100}ms` }}
                    aria-label={social.label}
                  >
                    <social.icon size={16} className="sm:w-5 sm:h-5 group-hover:animate-pulse" />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div
              className={`transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h4 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6">Quick Links</h4>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { name: "Home", id: "home" },
                  { name: "About Us", id: "about" },
                  { name: "Our Services", id: "services" },
                  { name: "Our Team", id: "team" },
                  { name: "Contact Us", id: "contact" },
                ].map((link, index) => (
                  <li key={link.name}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-[#2e7d32] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={openProductSheet}
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition-colors duration-300 hover:translate-x-1 flex items-center gap-2 group"
                  >
                    <ExternalLink
                      size={10}
                      className="sm:w-3 sm:h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    Products Catalog
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Our Services */}
            <div
              className={`transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h4 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6">Our Services</h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/70">
                {[
                  "Wholesale Distribution",
                  "Regulatory Support",
                  "International Logistics",
                  "Quality Assurance",
                  "24/7 Customer Support",
                  "Just-in-Time Delivery",
                ].map((service, index) => (
                  <li key={service} className="hover:text-white transition-colors duration-300 hover:translate-x-1">
                    <span className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#2e7d32] rounded-full" />
                      {service}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div
              className={`transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <h4 className="text-sm sm:text-lg font-bold mb-3 sm:mb-6">Contact Info</h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-2 sm:space-x-3 group">
                  <div className="bg-gray-800 p-1.5 sm:p-2 rounded-full group-hover:bg-[#2e7d32] transition-colors duration-300">
                    <MapPin size={12} className="sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                    <p>Godown 8, Roy Business Park</p>
                    <p>Baba Dogo Road, Nairobi, Kenya</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="bg-gray-800 p-1.5 sm:p-2 rounded-full group-hover:bg-[#2e7d32] transition-colors duration-300">
                    <Phone size={12} className="sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                    <p>+254 748 210210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-3 group">
                  <div className="bg-gray-800 p-1.5 sm:p-2 rounded-full group-hover:bg-[#2e7d32] transition-colors duration-300">
                    <Mail size={12} className="sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="text-xs sm:text-sm text-white/70 group-hover:text-white transition-colors duration-300">
                    <p>info@biogexpharma.com</p>
                    <p>sales@biogexpharma.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="border-t border-gray-700">
          <div
            className={`max-w-screen-sm lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 transition-all duration-1000 delay-800 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-white/50 text-center md:text-left">
                © 2025 BioGex Pharmaceuticals. All rights reserved.
              </p>
              <div className="flex space-x-4 sm:space-x-6 mt-3 md:mt-0">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-xs text-white/50 hover:text-[#2e7d32] transition-colors duration-300"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
