"use client"

import { useEffect, useState } from "react"
import { Users, Lightbulb, Target, Award, Building2, Globe, CheckCircle, Shield, MessageSquare, Heart, TrendingUp, ArrowDown } from "lucide-react"

export default function AboutSection() {
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

    const element = document.getElementById("about")
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToCoreValues = () => {
    const element = document.getElementById("core-values")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const openProductSheet = () => {
    window.location.href = "/products"
  }

  return (
    <section id="about" className="py-12 sm:py-20 bg-gradient-to-br from-green-100 via-green-50 to-green-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-8 sm:mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            About <span className="text-[#2e7d32]">BioGex Pharmaceuticals</span>
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Leading the future of pharmaceutical distribution with innovation, integrity, and unwavering commitment to
            healthcare excellence.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6 sm:space-y-8">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
              data-aos="fade-right"
              data-aos-duration="800"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
                Who We <span className="text-[#2e7d32]">Are</span>
              </h3>
              <p className="text-sm sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
                <span className="text-[#2e7d32] font-semibold">BioGex Pharmaceuticals</span> is a leading wholesale
                pharmaceutical distributor with over two decades of experience in connecting healthcare providers
                with premium medical products. We serve as the vital link between manufacturers and healthcare
                institutions worldwide, ensuring seamless access to life-saving medications.
              </p>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#2e7d32] mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm sm:text-base text-gray-700">Global pharmaceutical distribution network</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#2e7d32] mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm sm:text-base text-gray-700">Regulatory compliance expertise</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#2e7d32] mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm sm:text-base text-gray-700">Quality assurance and control</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#2e7d32] mt-1 flex-shrink-0" size={20} />
                  <span className="text-sm sm:text-base text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
            data-aos="fade-left"
            data-aos-duration="800"
            data-aos-delay="200"
          >
            <div className="relative max-w-[300px] mx-auto lg:max-w-none lg:mx-0">
              <img
                src="/biogexx.png"
                alt="BioGex Pharmaceuticals"
                className="rounded-lg sm:rounded-2xl shadow-xl w-full h-64 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-lg sm:rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`mt-12 sm:mt-20 grid md:grid-cols-3 gap-6 sm:gap-8 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="400"
        >
          <div className="text-center p-6 sm:p-8 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#2e7d32] text-white p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
              <Users size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Mission</h4>
            <p className="text-sm sm:text-base text-gray-600">
              To provide exceptional pharmaceutical distribution services through operational efficiencies and regulatory compliance.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-[#2e7d32] text-white p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
              <Lightbulb size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Vision</h4>
            <p className="text-sm sm:text-base text-gray-600">
              To be the leading distributor that guarantees availability, quality, affordable and fast-last mile delivery of essential medicines. We intend to build and empower healthcare for a better future in Kenya and across Africa.
            </p>
          </div>

          <div className="text-center p-6 sm:p-8 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="bg-[#2e7d32] text-white p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
              <Award size={20} className="sm:w-6 sm:h-6" />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Values</h4>
            <p className="text-sm sm:text-base text-gray-600 mb-4">
              The fundamental principles that guide our operations and shape our commitment to excellence in pharmaceutical distribution.
            </p>
            <button
              onClick={scrollToCoreValues}
              className="mt-4 mx-auto flex items-center justify-center gap-2 text-[#2e7d32] hover:text-[#1b5e20] transition-all duration-200 group-hover:translate-y-1"
              aria-label="Scroll to Core Values"
            >
              <span className="text-sm font-medium">Learn More</span>
              <ArrowDown size={18} className="group-hover:animate-bounce" />
            </button>
          </div>
        </div>

        {/* Quality Statement Section */}
        <div
          className={`mt-12 sm:mt-20 transition-all duration-1000 delay-900 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="600"
        >
          <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-[#2e7d32] text-white p-2 sm:p-3 rounded-lg">
                <Shield size={24} className="sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Quality <span className="text-[#2e7d32]">Statement</span>
              </h3>
            </div>
            <div className="space-y-4 text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
              <p>
                BioGex Pharma Limited is committed to providing high quality, affordable and fast-last mile delivery of essential pharmaceutical products through our distribution network.
              </p>
              <p>
                BioGex Pharma Limited operates in full compliance within the Pharmacy and Poisons Board of Kenya requirements and Good Distribution Practice (GDP) standards.
              </p>
              <p>
                BioGex Pharma Limited strives to maintain robust systems for procurement, storage, handling, transportation, and delivery of Pharmaceutical Product, and fit for their intended use.
              </p>
              <p>
                We prioritize patient safety by implementing strict quality controls, temperature monitoring, batch traceability, and effective recall procedures. Our team is trained to uphold ethical practices, regulatory compliance, and continuous improvement across all operations.
              </p>
              <p>
                Through reliable service, transparent processes, and strong partnerships, we aim to be a trusted pharmaceutical distribution partner that empowers healthcare for a better future.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div
          id="core-values"
          className={`mt-12 sm:mt-20 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          data-aos="fade-up"
          data-aos-duration="800"
          data-aos-delay="800"
        >
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our <span className="text-[#2e7d32]">Core Values</span>
            </h3>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#2e7d32] text-white p-3 rounded-lg flex-shrink-0">
                  <Users size={24} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">1. Teamwork & Collaboration</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    At the heart of our operations, teamwork. Together we build resilient systems to serve our customers better. By working together, we create resilient, efficient operations that consistently serve our customers better.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#2e7d32] text-white p-3 rounded-lg flex-shrink-0">
                  <MessageSquare size={24} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">2. Clear & Purposeful Communication</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We communicate openly, honestly, and with intent — with our teams, customers, partners, and stakeholders. Clear communication enables trust, alignment, and better service delivery across the healthcare value chain.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#2e7d32] text-white p-3 rounded-lg flex-shrink-0">
                  <Heart size={24} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">3. Ethics, Integrity & Trust</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We conduct all our operations with the highest ethical standards to build lasting trust among our employees, customers, regulators, and partners.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-[#2e7d32] text-white p-3 rounded-lg flex-shrink-0">
                  <TrendingUp size={24} className="sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">4. Innovation, Growth & Impact</h4>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We strive to innovate and strengthen our value proposition to meet evolving healthcare needs. Through growth and forward-thinking solutions, we aim to build and empower healthcare for a better future In Kenya and across Africa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
