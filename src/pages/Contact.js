import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Lottie from 'lottie-react';
import contactAnimation from '../assets/contact-animation.json';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs.sendForm('service_t84e8if', 'template_je2tt9e', form.current, 'w-BPtYL_WIabHlHsv')
      .then((result) => {
        console.log(result.text);
        setIsSubmitted(true);
        setIsError(false);
        form.current.reset();
      }, (error) => {
        console.log(error.text);
        setIsError(true);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => {
          setIsSubmitted(false);
          setIsError(false);
        }, 3000);
      });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-primary mb-12 text-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Get in Touch
        </motion.h1>

        <motion.div 
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid md:grid-cols-2">
            <motion.div className="p-8 bg-primary text-white" variants={itemVariants}>
              <h2 className="text-3xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <motion.p className="flex items-center" whileHover={{ x: 10 }}>
                  <EnvelopeIcon className="h-6 w-6 mr-3" />
                  info@swasthyasetu.com
                </motion.p>
                <motion.p className="flex items-center" whileHover={{ x: 10 }}>
                  <PhoneIcon className="h-6 w-6 mr-3" />
                  +91-7668291228
                </motion.p>
                <motion.p className="flex items-center" whileHover={{ x: 10 }}>
                  <MapPinIcon className="h-6 w-6 mr-3" />
                  INDIA
                </motion.p>
              </div>
              <div className="mt-12">
                <Lottie animationData={contactAnimation} style={{ height: 200 }} />
              </div>
            </motion.div>

            <motion.div className="p-8" variants={itemVariants}>
              <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
              <form ref={form} onSubmit={sendEmail} className="space-y-6">
                <div>
                  <label htmlFor="from_name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="from_name"
                    name="from_name"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="reply_to" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="reply_to"
                    name="reply_to"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  ></textarea>
                </div>
                <motion.button
                  type="submit"
                  className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </motion.div>

        {isSubmitted && (
          <motion.div
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Thank you for your message! We'll get back to you soon.
          </motion.div>
        )}

        {isError && (
          <motion.div
            className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            Oops! Something went wrong. Please try again later.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contact;