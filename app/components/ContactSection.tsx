"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required").refine(isValidPhoneNumber, "Enter a valid phone number"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorDetails, setErrorDetails] = useState("")

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setErrorDetails("")

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to send message")

      setIsSuccess(true)
      reset()
    } catch (err: any) {
      setErrorDetails(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-12 sm:py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Get in <span className="text-[#2e7d32]">Touch</span>
          </h2>
          <p className="text-sm sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to partner with us? Contact our team for personalized pharmaceutical solutions and expert guidance.
          </p>
        </div>

        {/* Contact Content */}
        <div className="flex flex-wrap gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Contact Information */}
          <div className="w-full md:w-1/4 space-y-6 sm:space-y-8">
            <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Contact Information</h3>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#2e7d32] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <MapPin className="text-white sm:w-6 sm:h-6" size={16} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg font-semibold text-gray-900">Address</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Godown 8, Roy Business Park
                    <br />
                    Baba Dogo Road, Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#2e7d32] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Phone className="text-white sm:w-6 sm:h-6" size={16} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg font-semibold text-gray-900">Phone</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    +254 748 210210
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#2e7d32] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Mail className="text-white sm:w-6 sm:h-6" size={16} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg font-semibold text-gray-900">Email</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    info@biogexpharma.com
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="bg-[#2e7d32] p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Clock className="text-white sm:w-6 sm:h-6" size={16} />
                </div>
                <div>
                  <h4 className="text-sm sm:text-lg font-semibold text-gray-900">Business Hours</h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Monday - Friday: 8:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 2:00 PM
                    <br />
                    24/7 Emergency Support
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6 sm:p-8 flex-1">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-12">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                  <CheckCircle className="text-green-600 mx-auto mb-4 w-16 h-16" />
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Message Sent!</h3>
                  <p className="text-gray-700 max-w-md mx-auto mb-6">
                    Thank you for reaching out. Our team will get back to you within 24-48 hours.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setIsSuccess(false)}
                    className="text-white font-medium bg-[#2e7d32] hover:bg-[#2e7d32]/80 !rounded-xl"
                  >
                    Send another message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input {...register("name")} className="bg-white" placeholder="Your Name" />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <Input {...register("email")} className="bg-white" placeholder="name@company.com" />
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number</label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PhoneInput
                        international
                        defaultCountry="KE"
                        countryCallingCodeEditable={false}
                        value={field.value}
                        onChange={(value) => field.onChange(value || "")}
                        onBlur={field.onBlur}
                        className="biogex-phone-input"
                        placeholder="Enter phone number"
                      />
                    )}
                  />
                  {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Subject</label>
                  <Input {...register("subject")} className="bg-white" placeholder="How can we help?" />
                  {errors.subject && <span className="text-red-500 text-xs">{errors.subject.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    {...register("message")}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent outline-none resize-none bg-white"
                    placeholder="Tell us about your inquiry..."
                  />
                  {errors.message && <span className="text-red-500 text-xs">{errors.message.message}</span>}
                </div>

                {errorDetails && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    {errorDetails}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white py-6 text-lg font-semibold shadow-md hover:shadow-xl"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Full-width Map */}
        <div className="relative z-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5!2d36.8894134!3d-1.2410655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1587933d4403%3A0x845c3be514cb9d4e!2sRoy%20Business%20Park!5e0!3m2!1sen!2ske!4v1722244080305!5m2!1sen!2ske"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  )
}
